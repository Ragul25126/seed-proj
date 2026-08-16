import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0f19] text-white border-t border-white/5 relative overflow-hidden">


      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-16">
          <div className="md:col-span-5 lg:col-span-6">
            <Image
              src="/seedlogo.png"
              alt="Seed Engineering"
              width={140}
              height={42}
              className="h-10 w-auto brightness-0 invert mb-6"
            />
            <p className="text-slate-400 text-[14px] leading-relaxed max-w-sm">
              Engineering high-performance buildings from concept to commissioning. SEED delivers integrated MEP design, supervision, sustainability, BIM coordination, and performance-focused engineering services across the Middle East, Africa, and Asia.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-6">Quick Links</h4>
            <ul className="space-y-4 text-[13px] text-white/70">
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="/sectors" className="hover:text-gold transition-colors">Sectors</Link></li>
              <li><Link href="/projects" className="hover:text-gold transition-colors">Projects</Link></li>
              <li><Link href="/why-seed" className="hover:text-gold transition-colors">Why SEED</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">Engineering Insights</Link></li>
              <li><Link href="/careers" className="hover:text-gold transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-6">Head Office</h4>
            <ul className="space-y-4 text-[13px] text-white/70 mb-8">
              <li className="leading-relaxed">
                #303, Old Commercial Bank of Dubai Building<br/>
                Opp. Hamarain Centre<br/>
                Abu Baker Al Siddique Road, Deira<br/>
                P O Box 119146, Dubai, UAE
              </li>
              <li><a href="tel:+97142564882" className="hover:text-gold transition-colors">+971 42 564 882</a></li>
              <li><a href="mailto:contact@seedengineering.com" className="hover:text-gold transition-colors">contact@seedengineering.com</a></li>
            </ul>
            
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-6">Follow Us</h4>
            <ul className="space-y-4 text-[13px] text-white/70 mb-8">
              <li>
                <a href="https://www.linkedin.com/company/seed-engineering" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  LinkedIn
                </a>
              </li>
            </ul>
            
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-6">Management</h4>
            <ul className="space-y-4 text-[13px] text-white/70">
              <li>
                <Link href="/admin/login" className="hover:text-gold transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center md:justify-center text-center text-[11px] text-white/40">
          <p>© {year} SEED Engineering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
