import { Sparkles } from 'lucide-react';
import { aboutContent, features, imagePlaceholder } from '../../data/aboutData';
import { backgroundImages } from '../../data/assetsData';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const About = () => {
  const [imageRef, imageVisible] = useScrollAnimation(0.2);
  const [textRef, textVisible] = useScrollAnimation(0.2);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.1);

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImages.aboutHero}
          alt="About Background"
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 left-0 w-96 h-96 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Image */}
          <div
            ref={imageRef}
            className={`order-2 lg:order-1 transition-all duration-1000 ${
              imageVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl shadow-2xl overflow-hidden hover-lift">
              {aboutContent.imagePlaceholder ? (
                <img
                  src={aboutContent.imagePlaceholder}
                  alt="Our Workshop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center text-stone-400"
                style={{
                  display: aboutContent.imagePlaceholder ? 'none' : 'flex',
                }}
              >
                <svg
                  className="w-32 h-32"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div
            ref={textRef}
            className={`order-1 lg:order-2 space-y-6 transition-all duration-1000 ${
              textVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {aboutContent.tagline}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              {aboutContent.heading}
            </h2>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef}>
          <h3
            className={`text-3xl md:text-4xl font-bold text-black text-center mb-12 transition-all duration-1000 ${
              featuresVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            What Makes Us Special
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`text-center group hover-lift bg-white rounded-2xl p-8 shadow-md transition-all duration-700 ${
                    featuresVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-md text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
