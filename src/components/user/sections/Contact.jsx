import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { useContactInfo, useSocialMedia, useSiteInfo } from '../../../hooks/useSupabaseData.js';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import Toast from '../common/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [toast, setToast] = useState(null);
  const [infoRef, infoVisible] = useScrollAnimation(0.2);
  const [formRef, formVisible] = useScrollAnimation(0.2);

  // Fetch data from Supabase
  const { data: contactInfo, loading: contactLoading, error: contactError } = useContactInfo();
  const { data: socialMedia, loading: socialLoading, error: socialError } = useSocialMedia();
  const { data: siteInfo, loading: siteLoading, error: siteError } = useSiteInfo();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show toast for feature under development
    setToast({
      message:
        'This feature is currently under development. Please contact us directly via phone or email.',
      type: 'info',
    });
    // Clear the form
    setFormData({ name: '', email: '', message: '' });
  };

  // Show loading state
  if (contactLoading || socialLoading || siteLoading) {
    return (
      <section id="contact" className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (contactError || socialError || siteError) {
    return (
      <section id="contact" className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-black mb-2">Error Loading Contact Info</h3>
            <p className="text-gray-600">Unable to load contact information. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-stone-50 py-16 md:py-24">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div
            ref={infoRef}
            className={`transition-all duration-1000 ${
              infoVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-4 opacity-100'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {siteInfo?.name || 'Contact Us'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {siteInfo?.description || 'Get in touch with us for any inquiries or questions.'}
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-black">Email</h3>
                  <a
                    href={`mailto:${contactInfo?.email || ''}`}
                    className="mt-1 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {contactInfo?.email || 'Loading...'}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-black">Phone</h3>
                  <a
                    href={`tel:${contactInfo?.phone || ''}`}
                    className="mt-1 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {contactInfo?.phone || 'Loading...'}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-black">Location</h3>
                  <p className="mt-1 text-gray-600">{contactInfo?.location || 'Loading...'}</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6">
                <h3 className="text-lg font-medium text-black mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={socialMedia?.facebook || '#'}
                    target="_blank"
                    className="flex items-center justify-center h-12 w-12 rounded-xl bg-white text-gray-600 hover:text-white hover:bg-amber-600 transition-all shadow-md hover:shadow-lg hover:scale-110"
                  >
                    <span className="sr-only">Facebook</span>
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href={socialMedia?.instagram || '#'}
                    target="_blank"
                    className="flex items-center justify-center h-12 w-12 rounded-xl bg-white text-gray-600 hover:text-white hover:bg-amber-600 transition-all shadow-md hover:shadow-lg hover:scale-110"
                  >
                    <span className="sr-only">Instagram</span>
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            ref={formRef}
            className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-1000 ${
              formVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-4 opacity-100'
            }`}
          >
            <h3 className="text-2xl font-bold text-black mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition hover:border-amber-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition hover:border-amber-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition resize-none hover:border-amber-300"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


