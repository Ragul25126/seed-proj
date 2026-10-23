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

// In-memory sliding window rate limiter: max 5 submissions per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipSubmissions.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipSubmissions.set(ip, timestamps);
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

  const toEmail = process.env.CONTACT_EMAIL_TO || 'contact@seedengineering.com';
  const fromEmail = process.env.CONTACT_EMAIL_FROM || 'SEED Engineering Inquiries <onboarding@resend.dev>';

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
          <div class="meta">Received from seedengineering.ae &bull; ID: ${data.id}</div>
        </div>
        <div class="field">
          <div class="label">Client Name</div>
          <div class="value"><strong>${data.name}</strong></div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${data.email}" style="color: #d4af37;">${data.email}</a></div>
        </div>
        ${data.phone ? `<div class="field"><div class="label">Phone</div><div class="value"><a href="tel:${data.phone}" style="color: #cbd5e1;">${data.phone}</a></div></div>` : ''}
        ${data.company ? `<div class="field"><div class="label">Company</div><div class="value">${data.company}</div></div>` : ''}
        ${data.country ? `<div class="field"><div class="label">Country</div><div class="value">${data.country}</div></div>` : ''}
        ${data.service ? `<div class="field"><div class="label">Service Required</div><div class="value">${data.service}</div></div>` : ''}
        ${data.sector ? `<div class="field"><div class="label">Project Sector</div><div class="value">${data.sector}</div></div>` : ''}
        <div class="field" style="margin-top: 24px;">
          <div class="label">Project Description / Message</div>
          <div class="message-box">${data.message}</div>
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
        reply_to: data.email,
        subject: `New Inquiry: ${data.name} - ${data.service || data.company || 'General'}`,
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
  // Rate limiting check
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before submitting another inquiry.' },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot spam trap: if hidden field is filled, silently drop bot submission
  if (body.website || body._gotcha) {
    return NextResponse.json({ ok: true, id: 'filtered' });
  }

  // Support fields from both InquiryForm and ContactPage form
  const name = (body.name || body.fullName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const subject = (body.subject || body.serviceType || body.service || '').trim();
  const message = (body.message || body.details || '').trim();
  const company = (body.company || '').trim();
  const country = (body.country || '').trim();
  const sector = (body.sector || '').trim();

  // Validation
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

