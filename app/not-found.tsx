import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | SEED Engineering',
  description: 'The requested page could not be found. Explore SEED Engineering portfolio and services.',
};

export default function NotFound() {
  return (
    <div className="bg-[#0b0f19] min-h-[75vh] text-slate-300 font-sans pt-40 pb-32 flex items-center selection:bg-gold selection:text-[#0b0f19]">
      <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
        <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
          404 ERROR
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          Page Not Found
        </h1>
        <p className="text-slate-400 font-light text-[15px] mb-10 leading-relaxed max-w-lg mx-auto">
          The page you are looking for does not exist, has been removed, or has moved to a new address.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-sm shadow-lg"
          >
            RETURN HOME
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors rounded-sm"
          >
            EXPLORE PROJECTS
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors rounded-sm"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </div>
  );
}
