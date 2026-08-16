'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

const CONTACT_CARDS = [
  {
    title: 'Dubai Headquarters',
    subtitle: 'Dubai, United Arab Emirates',
    icon: '📍',
    details: [
      { label: 'Address', value: '#303, Old Commercial Bank of Dubai Building, Opp. Hamarain Centre, Abu Baker Al Siddique Road, Deira P O Box 119146, Dubai, UAE' },
      { label: 'Telephone', value: '+971 42 564 882' },
      { label: 'Email', value: 'contact@seedengineering.com' },
    ],
  },
  {
    title: 'Business Hours',
    subtitle: 'Headquarters',
    icon: '⏰',
    details: [
      { label: 'Monday – Friday', value: '8:00 AM – 6:00 PM' },
      { label: 'Saturday & Sunday', value: 'Closed' },
      { label: 'Response Time', value: 'Within 24 Business Hours' },
    ],
  },
];

const OFFICES = [
  {
    city: 'Dubai Head Quarters',
    country: 'United Arab Emirates',
    address: '#303, Old Commercial Bank of Dubai Building, Opp. Hamarain Centre, Abu Baker Al Siddique Road, Deira P O Box 119146, Dubai, UAE',
    phone: '+971 42 564 882',
    email: 'contact@seedengineering.com',
  },
  {
    city: 'Bengaluru',
    country: 'India',
    address: 'No. 57, U.P. Complex, 1st Floor, Double Road, Indira Nagar, 2nd Stage, Bengaluru – 560038, Karnataka, India.',
  },
  {
    city: 'Mumbai',
    country: 'India',
    address: '3rd Floor, 304, Viraj Heights, Opposite Saraswat Bank, Kopri, Thane (East) – 400603, Maharashtra, India.',
  },
  {
    city: 'Gurugram',
    country: 'India',
    address: 'AltF Empire Square – Unit 19, 3rd Floor, JMD Empire Square, Near Sikanderpur Metro, MG Road, Gurugram, Haryana – 122002, India.',
  },
  {
    city: 'Kochi',
    country: 'India',
    address: '4A-2, A Wing, 4th Floor, Indeevaram Building, Infopark Thrissur, Nalikettu Road, Koratty, Kerala – 680308, India.',
  },
  {
    city: 'Pune',
    country: 'India',
    address: 'S. No. 52, Baner Business Bay, Pashan–Sus Road, Pune–Bangalore Highway, Pashan Exit, Behind Audi Off Mumbai, Mohan Nagar Co-operative Society, Baner, Pune – 411045, Maharashtra, India.',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    address: '10 Anson Road, #29-10, Singapore – 079903.',
  },
];

const SERVICES_OPTIONS = [
  'Select Service Required',
  '01 MEP Design',
  '02 MEP Supervision',
  '03 ELV / ICT & AV Design',
  '04 Security Systems Design',
  '05 Sustainability Consultancy',
  '06 Acoustics Consultancy',
  '07 Swimming Pool & Water Feature Design',
  '08 Spa Design',
];

const SECTOR_OPTIONS = [
  'Select Project Sector',
  'Hospitality',
  'Residential',
  'Commercial',
  'Education',
  'Healthcare',
  'Retail',
  'Sports & Stadiums',
  'Entertainment, Cultural & Theme Parks',
  'Aviation',
  'Villas & Private Estates',
  'Infrastructure & Sustainable Communities',
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    service: 'Select Service Required',
    sector: 'Select Project Sector',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('contact-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">

      {/* SECTION 01 – HERO BANNER */}
      <section className="relative pt-40 pb-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/dubai_skyline_night_1780503516791.webp"
            alt="SEED Headquarters"
            fill
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
              GET IN TOUCH
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Let’s Start a Conversation
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Whether you’re planning a new development, looking for an engineering partner, or exploring collaboration opportunities, our team is ready to help. Get in touch to discuss your project and discover how SEED can support your vision.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 02 – CONTACT INFORMATION */}
      <section className="py-24 bg-[#0f172a] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">REACH US DIRECTLY</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contact Information</h2>
              <p className="text-slate-400 font-light text-[15px]">Connect with our senior engineering team, business development, and regional headquarters.</p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CONTACT_CARDS.map((card, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-[#0b0f19] border border-white/8 p-8 rounded-sm h-full flex flex-col justify-between hover:border-gold/40 transition-colors group">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-xl mb-6 text-gold group-hover:bg-gold group-hover:text-[#0b0f19] transition-colors">
                      {card.icon}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{card.title}</h3>
                    <p className="text-gold/70 text-[11px] font-semibold tracking-wider uppercase mb-6">{card.subtitle}</p>

                    <div className="space-y-4 border-t border-white/5 pt-4">
                      {card.details.map((d, j) => (
                        <div key={j}>
                          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase block mb-1">{d.label}</span>
                          <span className="text-slate-300 text-[13px] font-light leading-relaxed block">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 03 – SEND US A MESSAGE */}
      <section id="contact-form" className="py-24 bg-[#0b0f19] scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left Content Column */}
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">INQUIRIES</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Send Us a Message</h2>
                <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                  Complete the form below and one of our senior engineering team members will get back to you as soon as possible.
                </p>
              </Reveal>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="bg-[#0f172a] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl">
                  {submitted ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 text-gold text-3xl flex items-center justify-center mx-auto mb-6">
                        ✓
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-3">Thank You for Getting in Touch</h3>
                      <p className="text-slate-400 text-sm font-light leading-relaxed max-w-md mx-auto mb-8">
                        Your message has been received by our engineering team. We will review your project requirements and respond within 24 business hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-8 py-3 bg-white/10 text-slate-300 hover:text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-sm"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-sm">
                          {error}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Full Name <span className="text-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Company <span className="text-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Company / Consultancy Name"
                            value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Email Address <span className="text-gold">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="john@company.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+971 XX XXX XXXX"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Country <span className="text-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. UAE, Singapore"
                            value={form.country}
                            onChange={e => setForm({ ...form, country: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Service Required
                          </label>
                          <select
                            value={form.service}
                            onChange={e => setForm({ ...form, service: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm [&>option]:bg-[#0b0f19] cursor-pointer"
                          >
                            {SERVICES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            Project Sector
                          </label>
                          <select
                            value={form.sector}
                            onChange={e => setForm({ ...form, sector: e.target.value })}
                            className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm [&>option]:bg-[#0b0f19] cursor-pointer"
                          >
                            {SECTOR_OPTIONS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                          Project Description / Message <span className="text-gold">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell us about your project scope, location, scale, and timeline..."
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          className="w-full bg-[#0b0f19] border border-white/10 px-4 py-3.5 text-slate-200 text-sm outline-none focus:border-gold rounded-sm placeholder:text-slate-600 resize-y"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-5 bg-gold hover:bg-yellow-500 disabled:bg-gold/50 text-[#0b0f19] font-sans text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm shadow-lg flex items-center justify-center gap-2"
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 04 – OUR OFFICES */}
      <section className="py-24 bg-[#0f172a] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">OUR OFFICES</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Global Presence</h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                With offices across the Middle East and India, our multidisciplinary teams are well positioned to support projects across the region.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OFFICES.map((off, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-[#0b0f19] border border-white/10 p-8 rounded-sm h-full flex flex-col justify-between hover:border-gold/40 transition-colors group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gold text-[10px] font-bold tracking-widest uppercase">Office 0{idx + 1}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-6 group-hover:text-gold transition-colors">{off.city}</h3>

                    <div className="space-y-3 border-t border-white/5 pt-4 text-[13px] text-slate-400 font-light">
                      <div>
                        <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase block mb-1">Address</span>
                        <p className="leading-relaxed">{off.address}</p>
                      </div>
                      {off.phone && (
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase block mb-1">Phone</span>
                          <a href={`tel:${off.phone}`} className="text-slate-300 hover:text-gold transition-colors">{off.phone}</a>
                        </div>
                      )}
                      {off.email && (
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase block mb-1">Email</span>
                          <a href={`mailto:${off.email}`} className="text-slate-300 hover:text-gold transition-colors">{off.email}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>



      {/* SECTION 07 – CALL TO ACTION */}
      <section className="py-28 relative overflow-hidden bg-[#0b0f19] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">NEXT STEPS</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Build Something Exceptional?
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-xl mx-auto mb-10">
              From concept to commissioning, our multidisciplinary engineering teams are ready to support your next project with integrated, performance-driven solutions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
              >
                Contact Our Team
              </button>
              <Link href="/projects" className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300 rounded-sm">
                Explore Our Projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
