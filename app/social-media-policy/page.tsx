import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Policy',
  description: 'Social Media Policy for SEED Engineering Consultants website.',
};

export default function SocialMediaPolicyPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      {/* HERO BANNER */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
            Legal & Compliance
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Social Media Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Official Guidelines & Online Communications Standard
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
                Social Media Policy
              </h2>
            </div>

            <hr className="border-white/5" />

            {/* REPURPOSED CONTENT & PERSONAL REPRESENTATIONS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                REPURPOSED CONTENT & PERSONAL REPRESENTATIONS
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                As with most social media channels, there will be user generated and distributed content produced by non-SEED personnel. This may include but is not limited to: Instagram comments, LinkedIn group and individual status updates. SEED cannot be held responsible for repurposed content and would therefore advise that only the official SEED channels listed here are referenced. Where individuals are active online, unless they are an approved spokesperson; it is to be understood that their comments are personal views and not necessarily representative of the company.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* RESERVE ALL RIGHTS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                RESERVE ALL RIGHTS
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                SEED reserves the right to remove and/or block Instagram followers, LinkedIn group members and company followers, as well as removing, modifying or adding content to anything posted on or to its official accounts.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* CONTACT US */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Contact Us
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:contact@seedengineering.com" className="text-gold hover:underline font-normal">contact@seedengineering.com</a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
