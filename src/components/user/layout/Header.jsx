import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteInfo, useNavLinks } from '../../../hooks/useSupabaseData.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch data from Supabase
  const { data: siteInfo, loading: siteLoading, error: siteError } = useSiteInfo();
  const { data: navLinks, loading: navLoading, error: navError } = useNavLinks();

  // Handle scrolling to hash on location change
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Track active section on scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [location.pathname]);

  const handleHashLinkClick = (e, href) => {
    e.preventDefault();
    const hash = href.slice(1); // Remove the leading '/'

    if (location.pathname === '/') {
      // Already on homepage, just scroll
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage with hash
      navigate('/' + hash);
    }

    setIsMenuOpen(false);
  };

  const isActive = (href) => {
    // For home link - only active when on homepage with no hash or active section
    if (href === '/') {
      return location.pathname === '/' && !activeSection;
    }
    // For hash links - check if this specific hash is the active section
    if (href.startsWith('/#')) {
      const hash = href.slice(1); // Get the hash part (e.g., "#about")
      // Only active if we're on homepage AND this exact section is active
      return location.pathname === '/' && activeSection === hash;
    }
    // For other routes
    return location.pathname === href;
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-stone-100 supports-[backdrop-filter]:bg-white/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl text-black font-bold group-hover:text-amber-600 transition-colors tracking-tight">
                {siteInfo?.name || 'Sent.'}
              </span>
              <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-600 font-light uppercase">
                {siteInfo?.tagline || 'Scented Candles'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {(navLinks || []).map((link) =>
              link.href.startsWith('/#') ? (
                <button
                  key={link.name}
                  onClick={(e) => handleHashLinkClick(e, link.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive(link.href)
                      ? 'text-black bg-amber-50'
                      : 'text-gray-600 hover:text-black hover:bg-amber-50'
                  }`}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive(link.href)
                      ? 'text-black bg-amber-50'
                      : 'text-gray-600 hover:text-black hover:bg-amber-50'
                  }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-black hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-stone-100 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-3 flex flex-col space-y-2">
            {(navLinks || []).map((link, index) =>
              link.href.startsWith('/#') ? (
                <button
                  key={link.name}
                  onClick={(e) => handleHashLinkClick(e, link.href)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all text-left ${
                    isActive(link.href)
                      ? 'text-black bg-amber-50 border border-amber-200'
                      : 'text-gray-600 hover:text-black hover:bg-amber-50'
                  }`}
                  style={{
                    animation: isMenuOpen
                      ? `slideIn 0.3s ease-out ${index * 0.1}s both`
                      : 'none',
                  }}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-black bg-amber-50 border border-amber-200'
                      : 'text-gray-600 hover:text-black hover:bg-amber-50'
                  }`}
                  style={{
                    animation: isMenuOpen
                      ? `slideIn 0.3s ease-out ${index * 0.1}s both`
                      : 'none',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;


