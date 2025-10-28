import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, changePassword, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { useAdminSiteInfo, useAdminContactInfo, useAdminSocialMedia, useAdminOperations } from '../../hooks/useAdminData.js';
import { adminDataService } from '../../services/adminDataService.js';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  
  // Fetch data from Supabase
  const { data: siteInfo, loading: siteLoading, error: siteError } = useAdminSiteInfo();
  const { data: contactInfo, loading: contactLoading, error: contactError } = useAdminContactInfo();
  const { data: socialMedia, loading: socialLoading, error: socialError } = useAdminSocialMedia();
  const { loading: operationLoading, error: operationError, executeOperation } = useAdminOperations();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Site settings form data
  const [siteData, setSiteData] = useState({
    name: '',
    tagline: '',
    description: '',
    year: new Date().getFullYear()
  });
  
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    location: '',
    address: ''
  });
  
  const [socialData, setSocialData] = useState({
    facebook: '',
    instagram: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) navigate('/admin/login');
    };
    checkAuth();
  }, [navigate]);

  // Populate form data when data is loaded
  useEffect(() => {
    if (siteInfo) {
      setSiteData({
        name: siteInfo.name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        year: siteInfo.year || new Date().getFullYear()
      });
    }
  }, [siteInfo]);

  useEffect(() => {
    if (contactInfo) {
      setContactData({
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        location: contactInfo.location || '',
        address: contactInfo.address || ''
      });
    }
  }, [contactInfo]);

  useEffect(() => {
    if (socialMedia) {
      setSocialData({
        facebook: socialMedia.facebook || '',
        instagram: socialMedia.instagram || ''
      });
    }
  }, [socialMedia]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    const res = await changePassword(currentPassword, newPassword);
    if (!res.ok) {
      setMessage({ type: 'error', text: res.error || 'Failed to update password.' });
      return;
    }
    setMessage({ type: 'success', text: 'Password updated. Please sign in again.' });
    await logout();
    setTimeout(() => navigate('/admin/login'), 1200);
  };

  const handleSaveSiteInfo = async () => {
    try {
      await executeOperation(() => adminDataService.updateSiteInfo(siteData));
      setMessage({ type: 'success', text: 'Site information updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update site information.' });
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      await executeOperation(() => adminDataService.updateContactInfo(contactData));
      setMessage({ type: 'success', text: 'Contact information updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update contact information.' });
    }
  };

  const handleSaveSocialMedia = async () => {
    try {
      await executeOperation(() => adminDataService.updateSocialMedia(socialData));
      setMessage({ type: 'success', text: 'Social media links updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update social media links.' });
    }
  };

  // Show loading state
  if (siteLoading || contactLoading || socialLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  // Show error state
  if (siteError || contactError || socialError) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Error Loading Settings</h3>
              <p className="text-gray-600">Unable to load settings. Please try again later.</p>
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
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <Link to="/admin" className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">Settings</h1>

          <div className="bg-white rounded-2xl border border-stone-200 shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="Enter current password" 
                    className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="At least 6 characters" 
                      className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Re-enter new password" 
                      className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {message && (
                <div className={`${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'} border rounded-lg px-3 py-2 text-sm`}>{message.text}</div>
              )}
              <div className="flex items-center justify-end gap-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <AdminFooter />
    </div>
  );
};

export default Settings;


