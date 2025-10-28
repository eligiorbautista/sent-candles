import { Heart } from 'lucide-react';
import { useSiteInfo } from '../../hooks/useSupabaseData.js';

const AdminFooter = () => {
  const year = new Date().getFullYear();
  const { data: siteInfo, loading, error } = useSiteInfo();
  
  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-black font-semibold">{siteInfo?.name || 'Sent.'}</span>
            <span className="text-xs tracking-widest uppercase text-gray-500">{siteInfo?.tagline || 'Scented Candles'}</span>
          </div>
          <span>© {year} {siteInfo?.name || 'Sent.'} {siteInfo?.tagline || 'Scented Candles'}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-stone-200 text-center">
          <p className="text-sm text-amber-600 font-medium inline-flex items-center justify-center gap-1">
            Built with <Heart className="w-4 h-4 fill-current" /> by{' '}
            <a
              href="https://www.facebook.com/elirbautista"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700 transition-colors"
            >
              Eli Bautista
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;


