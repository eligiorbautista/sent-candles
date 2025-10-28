import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { databaseService } from '../../config/supabase.js';
import { ArrowLeft, Save, RefreshCw, AlertCircle, CheckCircle, Home, BookOpen, Phone, Share2, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form states for each content type
  const [heroContent, setHeroContent] = useState({
    badge: '',
    heading_line1: '',
    heading_line2: '',
    description: '',
    stats: [],
    hero_image: ''
  });

  const [aboutContent, setAboutContent] = useState({
    tagline: '',
    heading: '',
    paragraphs: [],
    image_placeholder: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: ''
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: ''
  });

  const [siteInfo, setSiteInfo] = useState({
    name: '',
    tagline: '',
    description: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) navigate('/admin/login');
    };
    checkAuth();
    loadContent();
  }, [navigate]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Load all content types
      const [hero, about, contact, social, site] = await Promise.all([
        databaseService.getHeroContent(),
        databaseService.getAboutContent(),
        databaseService.getContactInfo(),
        databaseService.getSocialMedia(),
        databaseService.getSiteInfo()
      ]);

      if (hero) {
        setHeroContent({
          badge: hero.badge || '',
          heading_line1: hero.heading_line1 || '',
          heading_line2: hero.heading_line2 || '',
          description: hero.description || '',
          stats: hero.stats || [],
          hero_image: hero.hero_image || ''
        });
      }

      if (about) {
        setAboutContent({
          tagline: about.tagline || '',
          heading: about.heading || '',
          paragraphs: about.paragraphs || [],
          image_placeholder: about.image_placeholder || ''
        });
      }

      if (contact) {
        setContactInfo({
          email: contact.email || '',
          phone: contact.phone || '',
          location: contact.location || ''
        });
      }

      if (social) {
        setSocialMedia({
          facebook: social.facebook || '',
          instagram: social.instagram || ''
        });
      }

      if (site) {
        setSiteInfo({
          name: site.name || '',
          tagline: site.tagline || '',
          description: site.description || ''
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (contentType) => {
    setSaving(true);
    try {
      let data, updateFunction;
      
      switch (contentType) {
        case 'hero':
          data = heroContent;
          updateFunction = databaseService.updateHeroContent;
          break;
        case 'about':
          data = aboutContent;
          updateFunction = databaseService.updateAboutContent;
          break;
        case 'contact':
          data = contactInfo;
          updateFunction = databaseService.updateContactInfo;
          break;
        case 'social':
          data = socialMedia;
          updateFunction = databaseService.updateSocialMedia;
          break;
        case 'site':
          data = siteInfo;
          updateFunction = databaseService.updateSiteInfo;
          break;
        default:
          throw new Error('Invalid content type');
      }

      await updateFunction(data);
      setMessage({ type: 'success', text: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content saved successfully!` });
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: `Failed to save ${contentType} content` });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'about', label: 'About Section', icon: BookOpen },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'site', label: 'Site Info', icon: Settings }
  ];

  const renderHeroContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Badge Text</label>
          <input
            type="text"
            value={heroContent.badge}
            onChange={(e) => setHeroContent({ ...heroContent, badge: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Handcrafted with Love"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Hero Image URL</label>
          <input
            type="url"
            value={heroContent.hero_image}
            onChange={(e) => setHeroContent({ ...heroContent, hero_image: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Heading Line 1</label>
          <input
            type="text"
            value={heroContent.heading_line1}
            onChange={(e) => setHeroContent({ ...heroContent, heading_line1: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Hand-Crafted"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Heading Line 2</label>
          <input
            type="text"
            value={heroContent.heading_line2}
            onChange={(e) => setHeroContent({ ...heroContent, heading_line2: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Candles"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Description</label>
        <textarea
          value={heroContent.description}
          onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="Main description text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Stats (JSON format)</label>
        <textarea
          value={JSON.stringify(heroContent.stats, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setHeroContent({ ...heroContent, stats: parsed });
            } catch {
              // Invalid JSON, don't update
            }
          }}
          rows={6}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm"
          placeholder='[{"value": "100%", "label": "Soy Wax"}, {"value": "15+", "label": "Hours Burn"}]'
        />
      </div>
    </div>
  );

  const renderAboutContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Tagline</label>
          <input
            type="text"
            value={aboutContent.tagline}
            onChange={(e) => setAboutContent({ ...aboutContent, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Our Story"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Heading</label>
          <input
            type="text"
            value={aboutContent.heading}
            onChange={(e) => setAboutContent({ ...aboutContent, heading: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., About Sent. Candles"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Image URL</label>
        <input
          type="url"
          value={aboutContent.image_placeholder}
          onChange={(e) => setAboutContent({ ...aboutContent, image_placeholder: e.target.value })}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Paragraphs (JSON format)</label>
        <textarea
          value={JSON.stringify(aboutContent.paragraphs, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setAboutContent({ ...aboutContent, paragraphs: parsed });
            } catch {
              // Invalid JSON, don't update
            }
          }}
          rows={8}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm"
          placeholder='["First paragraph...", "Second paragraph...", "Third paragraph..."]'
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Phone</label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="+63 912 345 6789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Address</label>
        <input
          type="text"
          value={contactInfo.location}
          onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="e.g., New York, NY"
        />
      </div>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black mb-1">Facebook URL</label>
        <input
          type="url"
          value={socialMedia.facebook}
          onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="https://facebook.com/yourpage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Instagram URL</label>
        <input
          type="url"
          value={socialMedia.instagram}
          onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="https://instagram.com/yourpage"
        />
      </div>
    </div>
  );

  const renderSiteInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Site Name</label>
          <input
            type="text"
            value={siteInfo.name}
            onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Sent."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Tagline</label>
          <input
            type="text"
            value={siteInfo.tagline}
            onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g., Scented Candles"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Description</label>
        <textarea
          value={siteInfo.description}
          onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="Site description..."
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return renderHeroContent();
      case 'about':
        return renderAboutContent();
      case 'contact':
        return renderContactInfo();
      case 'social':
        return renderSocialMedia();
      case 'site':
        return renderSiteInfo();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AdminHeader />
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6 space-y-2">
            <div>
              <Link to="/admin" className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-black">Content Manager</h1>
              <button onClick={handleLogout} className="bg-stone-100 text-black px-4 py-2 rounded-lg hover:bg-stone-200 inline-flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-stone-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2 inline-flex items-center">
                      {React.createElement(tab.icon, { className: "w-4 h-4" })}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </h2>
              <button
                onClick={() => handleSave(activeTab)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {renderContent()}
          </div>
        </div>
      </section>
      <AdminFooter />
    </div>
  );
};

export default ContentManager;
