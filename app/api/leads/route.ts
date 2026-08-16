import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Set DNS order to prefer IPv4 on Node.js to prevent local network resolution timeouts
import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const formattedUrl = supabaseUrl.startsWith('http')
  ? supabaseUrl
  : `https://${supabaseUrl}.supabase.co`;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Support fields from both InquiryForm and ContactPage form
  const name = (body.name || body.fullName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const subject = (body.subject || body.serviceType || body.service || '').trim();
  const message = (body.message || body.details || '').trim();
  const company = (body.company || '').trim();

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
