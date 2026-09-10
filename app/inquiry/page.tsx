import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionLabel } from '@/components/ui/Section';
import InquiryForm from '@/components/forms/InquiryForm';
import { settings } from '@/lib/data';

export const metadata = {
  title: 'Project Inquiry',
  description: 'Tell us about your project. A senior member of the studio will reply within 24 hours.',
};

export default function Inquiry() {

  return (
    <>
      <PageHero
        eyebrow="Project inquiry"
        title={<>Tell us about your project. A senior partner will read it <span>personally.</span></>}
        intro="No sales script. No discovery call sequence. Send a short message, get a thoughtful reply within one working day."
      />

      <Section tone="cream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4">
            <SectionLabel>What to include</SectionLabel>
            <ul className="space-y-4 text-navy/70">
              <li className="flex items-start gap-3"><span className="text-navy/40 mt-1">·</span><span>The type of building or project</span></li>
              <li className="flex items-start gap-3"><span className="text-navy/40 mt-1">·</span><span>The stage you are at — concept, tender, build, in-service</span></li>
              <li className="flex items-start gap-3"><span className="text-navy/40 mt-1">·</span><span>Approximate scale and timeline</span></li>
              <li className="flex items-start gap-3"><span className="text-navy/40 mt-1">·</span><span>Anything constraining you that makes the project unusual</span></li>
            </ul>

            <div className="mt-12 border-t border-navy/10 pt-8">
              <p className="label text-navy/50 mb-4 tracking-[0.3em]">Or reach us directly</p>
              <div className="space-y-2 text-sm">
                <a href={`mailto:${settings.email}`} className="block text-navy hover:text-navy/60">{settings.email}</a>
                <a href={`tel:${settings.phone}`} className="block text-navy hover:text-navy/60">{settings.phone}</a>
                <span className="block text-navy/50">Telegram {settings.telegramHandle}</span>
                <span className="block text-navy/50">WhatsApp {settings.whatsappNumber}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
