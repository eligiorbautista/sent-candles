import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { databaseService } from '../../config/supabase.js';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, RefreshCw, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssetsManager = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    url: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) navigate('/admin/login');
    };
    checkAuth();
    loadAssets();
  }, [navigate]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await databaseService.getAssets();
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      setMessage({ type: 'error', text: 'Failed to load assets' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingAsset) {
        // Update existing asset
        await databaseService.updateAsset(editingAsset.id, formData);
        setMessage({ type: 'success', text: 'Asset updated successfully!' });
      } else {
        // Create new asset
        await databaseService.createAsset(formData);
        setMessage({ type: 'success', text: 'Asset created successfully!' });
      }
      
      setShowModal(false);
      setEditingAsset(null);
      setFormData({
        key: '',
        type: 'background_image',
        url: '',
        alt_text: '',
        description: '',
        sort_order: 0
      });
      loadAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      setMessage({ type: 'error', text: 'Failed to save asset' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      key: asset.key,
      type: asset.type,
      url: asset.url,
      alt_text: asset.alt_text || '',
      description: asset.description || '',
      sort_order: asset.sort_order
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      await databaseService.deleteAsset(id);
      setMessage({ type: 'success', text: 'Asset deleted successfully!' });
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      setMessage({ type: 'error', text: 'Failed to delete asset' });
    }
  };

  const handleNewAsset = () => {
    setEditingAsset(null);
    setFormData({
      url: ''
    });
    setShowModal(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const assetTypes = [
    { value: 'background_image', label: 'Background Image' },
    { value: 'logo', label: 'Logo' },
    { value: 'icon', label: 'Icon' },
    { value: 'banner', label: 'Banner' },
    { value: 'other', label: 'Other' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assets...</p>
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
              <h1 className="text-2xl md:text-3xl font-bold text-black">Assets Manager</h1>
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="bg-stone-100 text-black px-4 py-2 rounded-lg hover:bg-stone-200 inline-flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
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

          {/* Assets Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-black">Assets ({assets.length})</h2>
            </div>
            
            {assets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No assets found. Click "Add Asset" to create your first asset.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{asset.key}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{asset.url}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{asset.description || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(asset)}
                              className="px-3 py-1.5 rounded-lg border border-stone-300 text-gray-700 hover:border-black"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">
                  {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-1">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            </div>

            <div className="p-6 border-t border-stone-200 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.key || !formData.url}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </div>
  );
};

export default AssetsManager;
