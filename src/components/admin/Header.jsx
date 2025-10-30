import { Link } from 'react-router-dom';
import { useSiteInfo } from '../../hooks/useSupabaseData.js';
import { ExternalLink } from 'lucide-react';

const AdminHeader = () => {
  const { data: siteInfo, loading, error } = useSiteInfo();

  return (
    <>
      <header className="fixed w-full left-0 top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-stone-200 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl text-black font-bold group-hover:text-amber-600 transition-colors tracking-tight">
                {siteInfo?.name || 'Sent.'}
              </span>
              <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-600 font-light uppercase">
                {siteInfo?.tagline || 'Scented Candles'}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
              Admin
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-stone-300 text-gray-700 hover:text-black hover:border-black transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </Link>
          </div>
        </nav>
      </header>
      {/* spacer to offset the fixed header so page content isn't covered */}
      <div aria-hidden="true" className="h-16" />
    </>
  );
};

export default AdminHeader;
