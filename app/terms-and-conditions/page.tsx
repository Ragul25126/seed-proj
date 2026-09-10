import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions for SEED Engineering Consultants website.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      {/* HERO BANNER */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
            Legal & Compliance
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            General Terms & Conditions of Use
          </p>
        </div>
      </section>

      {/* POLICY CONTENT BODY */}
      <section className="py-20 bg-[#0f172a] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="bg-[#0b0f19] border border-white/10 p-8 md:p-14 rounded-sm shadow-2xl space-y-10">

            {/* HEADER INTRO */}
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
                Terms & Conditions
              </h2>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                These terms and conditions (“Terms”, “Agreement”) are an agreement between Website Operator (“Website Operator”, “us”, “we” or “our”) and you (“User”, “you” or “your”). This Agreement sets forth the general terms and conditions of your use of the <a href="https://www.seedengineering.com/" className="text-gold hover:underline">https://www.seedengineering.com/</a> website and any of its products or services (collectively, “Website” or “Services”).
              </p>
            </div>

            <hr className="border-white/5" />

            {/* BACKUPS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                BACKUPS
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                We are not responsible for Content residing on the Website. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* LINKS TO OTHER WEBSITES */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                LINKS TO OTHER WEBSITES
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                Although this Website may link to other websites, we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked website, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their websites. We do not assume any responsibility or liability for the actions, products, services, and content of any other third-parties. You should carefully review the legal statements and other conditions of use of any website which you access through a link from this Website. Your linking to any other off-site websites is at your own risk.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* CHANGES AND AMENDMENTS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                CHANGES AND AMENDMENTS
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                We reserve the right to modify this Agreement or its policies relating to the Website or Services at any time, effective upon posting of an updated version of this Agreement on the Website. When we do, we will revise the updated date at the bottom of this page. Continued use of the Website after any such changes shall constitute your consent to such changes.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* ACCEPTANCE OF THESE TERMS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                ACCEPTANCE OF THESE TERMS
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                You acknowledge that you have read this Agreement and agree to all its terms and conditions. By using the Website or its Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorised to use or access the Website and its Services.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* CONTACTING US */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                CONTACTING US
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-6">
                If you would like to contact us to understand more about this Agreement or wish to contact us concerning any matter relating to it, you may send an email to: <a href="mailto:contact@seedengineering.com" className="text-gold hover:underline font-normal">contact@seedengineering.com</a>.
              </p>
              <p className="text-slate-500 text-xs font-mono">
                This document was last updated on September 7, 2026.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
