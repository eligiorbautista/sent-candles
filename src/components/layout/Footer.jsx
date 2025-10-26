import { Facebook, Instagram, Heart } from 'lucide-react';
import { siteInfo, footerLinks } from '../../data/siteData';
import { contactInfo, socialMedia } from '../../data/contactData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl mb-4">
              <span className="text-black font-bold block">
                {siteInfo.name}
              </span>
              <span className="text-xs tracking-[0.2em] text-gray-600 font-light uppercase">
                {siteInfo.tagline}
              </span>
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              {siteInfo.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={socialMedia.facebook}
                target="_blank"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={socialMedia.instagram}
                target="_blank"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-black mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-black mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>{contactInfo.email}</li>
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 text-center">
          <p className="text-gray-600 mb-2">
            &copy; {currentYear} {siteInfo.name} {siteInfo.tagline}. All rights
            reserved.
          </p>
          <p className="text-sm text-amber-600 font-medium flex items-center justify-center gap-1">
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

export default Footer;
