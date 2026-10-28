import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Set DNS order to prefer IPv4 on Node.js to prevent local network resolution timeouts
import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * In-memory sliding window rate limiter: max 5 submissions per 10 minutes per IP.
 *
 * SERVERLESS ARCHITECTURE LIMITATION & RISK DOCUMENTATION:
 * This in-memory Map is maintained within the single Node.js runtime process instance.
 * In a distributed, auto-scaling platform like Vercel, requests may be routed to different
 * concurrent containers or cold-start instances, each maintaining its own independent memory.
 * It reliably protects an individual active serverless instance against burst flooding, but
 * it does NOT enforce a globally coordinated rate limit across multiple concurrent Vercel
 * serverless function instances. To achieve synchronized multi-instance rate limiting without
 * third-party packages, an external distributed store (such as Upstash Redis or Vercel KV)
 * or edge-level firewall rules (e.g. Vercel WAF / Cloudflare) would be required.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipSubmissions.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipSubmissions.set(ip, timestamps);
    // Blocked requests do NOT append `now`, ensuring the rate-limit window is not extended
    return true;
  }

  timestamps.push(now);
  ipSubmissions.set(ip, timestamps);

  // Periodically clean up stale records when map grows
  if (ipSubmissions.size > 1000) {
    for (const [key, times] of ipSubmissions.entries()) {
      const valid = times.filter((t) => t > windowStart);
      if (valid.length === 0) {
        ipSubmissions.delete(key);
      } else {
        ipSubmissions.set(key, valid);
      }
    }
  }

  return false;
}

/**
 * Safely extracts the client IP address in a Vercel-deployed Next.js environment.
 *
 * VERCEL HEADER TRUST ARCHITECTURE:
 * 1. 'x-real-ip': In Vercel's edge network, Vercel strips any client-supplied 'x-real-ip'
 *    headers and sets this header to the connecting client's true TCP/IP address. This is
 *    the primary trusted header in production.
 * 2. 'x-vercel-forwarded-for': Vercel-specific forwarded chain populated by Vercel edge.
 * 3. 'x-forwarded-for': Standard proxy header. When an attacker sends 'X-Forwarded-For: spoofed-ip',
 *    upstream reverse proxies APPEND the true IP at the end ('spoofed-ip, real-client-ip').
 *    Therefore, taking the FIRST IP is vulnerable to spoofing. If inspecting 'x-forwarded-for',
 *    we take the LAST entry added by the trusted proxy hop.
 * 4. Fallback: If no proxy headers exist (e.g. direct local development), returns '127.0.0.1'
 *    in development, or 'unresolved-client' in production. All unidentifiable requests in production
 *    share the 'unresolved-client' bucket to prevent unmetered bypass.
 */
function getClientIp(req: NextRequest): string {
  // 1. Primary: Vercel-sanitized real client IP
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) {
    return realIp;
  }

  // 2. Secondary: Vercel edge proxy forwarded header (take rightmost hop)
  const vercelForwarded = req.headers.get('x-vercel-forwarded-for')?.trim();
  if (vercelForwarded) {
    const parts = vercelForwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  // 3. Fallback: Standard x-forwarded-for (take rightmost hop added by outermost proxy)
  const forwarded = req.headers.get('x-forwarded-for')?.trim();
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  // 4. Safe fallback when running without reverse proxy
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }

  return 'unresolved-client';
}

/**
 * HTML-escape helper for untrusted user inputs to prevent HTML/XSS injection in emails.
 */
function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates an email address.
 * Rejects control characters, CRLF, whitespace, quotes, HTML characters, and non-conforming formats.
 * Returns the normalized (trimmed) email string if valid, or null if invalid.
 */
function validateEmail(email: unknown): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return null;
  if (/[\r\n\t\s"'/<>]/i.test(trimmed)) {
    return null;
  }
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Safely format an email address for use in mailto: attributes.
 * Validates the address format. Returns the mailto: URL if valid,
 * or null if invalid or unsafe, preventing silent mutation of the destination.
 */
function safeMailto(email: string): string | null {
  const valid = validateEmail(email);
  if (!valid) return null;
  return `mailto:${encodeURI(valid)}`;
}

/**
 * Safely format a phone number for use in tel: attributes.
 * Restricts to valid telephone characters (digits, +, -, (, ), ., and spaces).
 * Returns the tel: URI if valid digits are present, or null if invalid.
 */
function safeTel(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  const trimmed = phone.trim();
  if (/[\r\n\t"'/<>]/i.test(trimmed)) return null;
  if (!/^[0-9+\-().\s]+$/.test(trimmed) || !/\d/.test(trimmed)) {
    return null;
  }
  return `tel:${encodeURIComponent(trimmed)}`;
}

// Forward inquiry via Resend API if configured
async function forwardInquiryEmail(data: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  service?: string;
  sector?: string;
  message: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return;
  }

  // Ensure the inquiry email is validated; never use an unvalidated address in the Resend payload
  const validatedEmail = validateEmail(data.email);
  if (!validatedEmail) {
    console.error('Cannot forward inquiry email: invalid or unvalidated email address');
    return;
  }

  const toEmail = process.env.CONTACT_EMAIL_TO || 'contact@seedengineering.com';
  const fromEmail = process.env.CONTACT_EMAIL_FROM || 'SEED Engineering Inquiries <onboarding@resend.dev>';

  // Clean and length-limit each interpolated field for the email subject header (strip all CR/LF)
  const cleanName = (data.name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 100);
  const serviceOrCompany = data.service || data.company || 'General';
  const cleanCategory = serviceOrCompany.replace(/[\r\n]+/g, ' ').trim().slice(0, 100);
  const emailSubject = `New Inquiry: ${cleanName} - ${cleanCategory}`.slice(0, 250);

  // Safely resolve mailto: and tel: links; reuse validated email for display and link logic
  const mailtoUrl = safeMailto(validatedEmail);
  const emailFieldHtml = mailtoUrl
    ? `<a href="${escapeHtml(mailtoUrl)}" style="color: #d4af37;">${escapeHtml(validatedEmail)}</a>`
    : `<span style="color: #d4af37;">${escapeHtml(validatedEmail)}</span>`;

  const telUrl = data.phone ? safeTel(data.phone) : null;
  const phoneFieldHtml = data.phone
    ? `<div class="field"><div class="label">Phone</div><div class="value">${
        telUrl
          ? `<a href="${escapeHtml(telUrl)}" style="color: #cbd5e1;">${escapeHtml(data.phone)}</a>`
          : `<span style="color: #cbd5e1;">${escapeHtml(data.phone)}</span>`
      }</div></div>`
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 24px; margin: 0; }
        .card { background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 32px; max-width: 600px; margin: 0 auto; }
        .header { border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 16px; margin-bottom: 24px; }
        .title { color: #d4af37; font-size: 20px; font-weight: 600; margin: 0 0 6px 0; }
        .meta { color: #94a3b8; font-size: 13px; }
        .field { margin-bottom: 16px; }
        .label { color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 4px; }
        .value { color: #e2e8f0; font-size: 15px; }
        .message-box { background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 class="title">New Website Inquiry</h2>
          <div class="meta">Received from seedengineering.ae &bull; ID: ${escapeHtml(data.id)}</div>
        </div>
        <div class="field">
          <div class="label">Client Name</div>
          <div class="value"><strong>${escapeHtml(data.name)}</strong></div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="value">${emailFieldHtml}</div>
        </div>
        ${phoneFieldHtml}
        ${data.company ? `<div class="field"><div class="label">Company</div><div class="value">${escapeHtml(data.company)}</div></div>` : ''}
        ${data.country ? `<div class="field"><div class="label">Country</div><div class="value">${escapeHtml(data.country)}</div></div>` : ''}
        ${data.service ? `<div class="field"><div class="label">Service Required</div><div class="value">${escapeHtml(data.service)}</div></div>` : ''}
        ${data.sector ? `<div class="field"><div class="label">Project Sector</div><div class="value">${escapeHtml(data.sector)}</div></div>` : ''}
        <div class="field" style="margin-top: 24px;">
          <div class="label">Project Description / Message</div>
          <div class="message-box">${escapeHtml(data.message)}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: validatedEmail,
        subject: emailSubject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend email delivery returned error:', res.status, errText);
    }
  } catch (err) {
    console.error('Resend email delivery network error:', err);
  }
}

export async function POST(req: NextRequest) {
  // 1. Payload size guard: reject payloads larger than 64 KB before parsing
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 65536) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  // 2. Request body parsing and structure validation
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Individual field length safety guard (prevents memory/DB bloat)
  const MAX_FIELD_LENGTH = 10000;
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: `Field '${key}' exceeds maximum permitted length` }, { status: 400 });
    }
  }

  // 3. Honeypot anti-bot filter:
  // Checked BEFORE rate limiting so automated bot submissions hitting the honeypot
  // do NOT consume the rate-limit quota for real users sharing the same network/IP.
  // Evaluates company_fax (new trap), website (legacy trap), and _gotcha (legacy trap).
  const isNonEmptyString = (val: unknown): boolean =>
    typeof val === 'string' && val.trim().length > 0;

  if (
    isNonEmptyString(body.company_fax) ||
    isNonEmptyString(body.website) ||
    isNonEmptyString(body._gotcha)
  ) {
    return NextResponse.json({ ok: true, id: 'filtered' });
  }

  // 4. Rate limiting check (server-side, Vercel-safe client IP extraction)
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before submitting another inquiry.' },
      { status: 429 }
    );
  }

  // 5. Support fields from both InquiryForm and ContactPage form
  const name = (body.name || body.fullName || '').toString().trim();
  const rawEmail = (body.email || '').toString().trim();
  const phone = (body.phone || '').toString().trim();
  const subject = (body.subject || body.serviceType || body.service || '').toString().trim();
  const message = (body.message || body.details || '').toString().trim();
  const company = (body.company || '').toString().trim();
  const country = (body.country || '').toString().trim();
  const sector = (body.sector || '').toString().trim();

  // 6. Field validation
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  // Validate email address once before database insertion and email forwarding
  const email = validateEmail(rawEmail);
  if (!email) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ error: 'A message of at least 5 characters is required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Database inquiry insertion failed: Missing Supabase environment variables');
    return NextResponse.json({ error: 'Server configuration error: missing Supabase credentials' }, { status: 500 });
  }

  const formattedUrl = supabaseUrl.startsWith('http')
    ? supabaseUrl
    : `https://${supabaseUrl}.supabase.co`;

  // Create public client using the publishable/anonymous key (respects RLS insert-only policy)
  const supabase = createClient(formattedUrl, supabaseAnonKey);

  const id = crypto.randomUUID();

  const { error } = await supabase
    .from('contact_inquiries')
    .insert({
      id,
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      company: company || null,
      status: 'new'
    });

  if (error) {
    console.error('Database inquiry insertion failed:', error);
    return NextResponse.json({ error: `Failed to save inquiry: ${error.message}` }, { status: 500 });
  }

  // Bust Next.js cache so any server renders get fresh data
  try {
    revalidateTag('inquiries');
    revalidatePath('/admin/dashboard/inquiries');
    revalidatePath('/admin/dashboard');
  } catch (err) {}

  // Trigger email forwarding via Resend if configured
  await forwardInquiryEmail({
    id,
    name,
    email,
    phone,
    company,
    country,
    service: subject,
    sector,
    message,
  });

  // Trigger optional webhook notification if configured
  const webhook = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          email,
          phone,
          subject,
          message,
          company,
          country,
          sector,
          status: 'new',
          created_at: new Date().toISOString()
        }),
      });
    } catch (err) {
      console.error('Webhook delivery failed:', err);
    }
  }

  return NextResponse.json({ ok: true, id });
}

