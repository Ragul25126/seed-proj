'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SERVICE_OPTIONS = [
  'Commercial MEP',
  'Residential MEP',
  'HVAC Systems',
  'Electrical & Plumbing',
  'MEP Maintenance',
  'Pool Construction',
  'Pool Renovation',
  'Pool Maintenance',
  'Other',
];

type Errors = Partial<Record<'fullName' | 'phone' | 'email' | 'serviceType' | 'details', string>>;

export default function InquiryForm({
  defaultService,
  variant = 'light',
}: {
  defaultService?: string;
  variant?: 'light' | 'dark';
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceType: defaultService || SERVICE_OPTIONS[0],
    details: '',
  });

  const dark = variant === 'dark';
  const inputBase = cn(
    'w-full px-4 py-3 text-sm border bg-transparent transition-colors outline-none',
    dark
      ? 'border-white/15 text-white placeholder:text-white/30 focus:border-gold'
      : 'border-border text-body placeholder:text-muted focus:border-navy',
  );
  const labelCls = cn('label block mb-2', dark ? 'text-white/60' : 'text-secondary');

  function validate(): boolean {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.serviceType) e.serviceType = 'Required';
    if (!form.details.trim() || form.details.trim().length < 10) e.details = 'A few sentences please';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          'border p-10 text-center',
          dark ? 'border-gold/30 bg-white/5 text-white' : 'border-navy/20 bg-white text-body',
        )}
      >
        <p className="label text-gold mb-3">Received</p>
        <h3 className="h3 mb-2">Thank you. We will be in touch within 24 hours.</h3>
        <p className={cn('text-sm', dark ? 'text-white/60' : 'text-secondary')}>
          A senior member of the studio will read your inquiry personally and respond by your preferred contact method.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {error && (
        <div className="md:col-span-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-sm">
          {error}
        </div>
      )}
      <div>
        <label className={labelCls}>Full Name</label>
        <input
          className={inputBase}
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Your name"
        />
        {errors.fullName && <p className="text-xs text-gold mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label className={labelCls}>Phone Number</label>
        <input
          className={inputBase}
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+971 ..."
        />
        {errors.phone && <p className="text-xs text-gold mt-1">{errors.phone}</p>}
      </div>
      <div>
        <label className={labelCls}>Email Address</label>
        <input
          className={inputBase}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@company.com"
        />
        {errors.email && <p className="text-xs text-gold mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className={labelCls}>Service Type</label>
        <select
          className={cn(inputBase, dark ? '[&>option]:text-black' : '')}
          value={form.serviceType}
          onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
        >
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Project Details</label>
        <textarea
          rows={5}
          className={cn(inputBase, 'resize-none')}
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          placeholder="Tell us about your project, the building type, timeline, and any specific requirements."
        />
        {errors.details && <p className="text-xs text-gold mt-1">{errors.details}</p>}
      </div>
      <div className="md:col-span-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-gold text-ink px-7 py-3.5 text-sm font-medium hover:bg-[#d6b675] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send Inquiry'} <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
