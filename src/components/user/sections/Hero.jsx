import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useHeroData } from '../../../data/heroData';
import { useBackgroundImages } from '../../../data/assetsData';
import AnimatedCounter from '../../user/common/AnimatedCounter';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const { data: heroContent, loading: heroLoading } = useHeroData();
  const backgroundImages = useBackgroundImages();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use fallback data if loading or no data
  const content = heroContent || {
    badge: 'Handcrafted with Love',
    heading: { line1: 'Hand-Crafted', line2: 'Candles' },
    description: 'Each candle is a carefully crafted vessel, preserving the intangible: a Sentiment.',
    buttons: {
      primary: { text: 'View Collection', link: '/products' },
      secondary: { text: 'Our Story', link: '#about' }
    },
    stats: [
      { value: '100%', label: 'Soy Wax' },
      { value: '15+', label: 'Hours Burn' },
      { value: '17+', label: 'Scents' }
    ],
    heroImage: ''
  };

  const bgImage = backgroundImages.homeHero || '';

  return (
    <section id="home" className="relative pt-20 pb-12 md:pb-0 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Hero Background"
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating decorative background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
          style={{
            animationDelay: '2s',
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{
            animationDelay: '4s',
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`,
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)] flex items-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fadeInUp">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {content.badge}
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-black">{content.heading.line1}</span>
              <span className="block text-black mt-2">
                {content.heading.line2}
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                to={content.buttons.primary.link}
                className="group relative bg-black text-white px-8 py-4 rounded-full font-medium overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">
                  {content.buttons.primary.text}
                </span>
                <div className="absolute inset-0 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
              <a
                href={content.buttons.secondary.link}
                className="bg-white text-black px-8 py-4 rounded-full font-medium border-2 border-black hover:bg-black hover:text-white transition-all hover:shadow-xl hover:scale-105"
              >
                {content.buttons.secondary.text}
              </a>
            </div>

            {/* Stats with animated counters */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto lg:mx-0">
              {content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center lg:text-left transform hover:scale-110 transition-transform"
                >
                  <div className="text-3xl font-bold text-amber-600">
                    {stat.value.includes('%') ? (
                      <>
                        <AnimatedCounter end={parseInt(stat.value)} />%
                      </>
                    ) : stat.value.includes('+') ? (
                      <>
                        <AnimatedCounter end={parseInt(stat.value)} />+
                      </>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Image Display */}
          <div
            className="relative animate-fadeIn parallax pb-12 md:pb-0"
            style={{
              animationDelay: '0.3s',
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="relative z-10">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-3xl shadow-2xl overflow-hidden hover-lift glass-effect">
                {content.heroImage ? (
                  <img
                    src={content.heroImage}
                    alt="Featured Candle"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center text-amber-300"
                  style={{
                    display: content.heroImage ? 'none' : 'flex',
                  }}
                >
                  <svg
                    className="w-40 h-40 animate-float"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Decorative elements with parallax - Hidden on mobile */}
            <div
              className="hidden md:block absolute -bottom-8 -right-8 w-64 h-64 bg-amber-200 rounded-3xl -z-10 opacity-30 animate-pulse-slow"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            ></div>
            <div
              className="hidden md:block absolute -top-8 -left-8 w-48 h-48 bg-stone-200 rounded-full -z-10 opacity-40 animate-pulse-slow"
              style={{
                animationDelay: '1s',
                transform: `translateY(${scrollY * -0.08}px)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


