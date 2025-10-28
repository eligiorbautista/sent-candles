import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { useAdminEvents, useAdminOperations } from '../../hooks/useAdminData.js';
import { adminDataService } from '../../services/adminDataService.js';
import { ArrowLeft, LogOut, Plus } from 'lucide-react';
import Toast from '../../components/user/common/Toast.jsx';

const EventsManager = () => {
  const navigate = useNavigate();
  
  // Fetch data from Supabase
  const { data: items = [], loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useAdminEvents();
  const { loading: operationLoading, error: operationError, executeOperation } = useAdminOperations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Hardcoded categories for events/announcements
  const adminCategories = useMemo(() => [
    { id: 'Event', name: 'Event' },
    { id: 'Announcement', name: 'Announcement' }
  ], []);

  const filtered = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    const q = query.trim().toLowerCase();
    return items.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (!q) return true;
      const hay = [e.title, e.description, e.category].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, categoryFilter]);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) navigate('/admin/login');
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    try {
      await executeOperation(() => adminDataService.deleteEvent(id));
      await refetchEvents();
      setConfirmDelete(null);
      setToast({ message: 'Event deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting event:', error);
      setToast({ message: 'Failed to delete event', type: 'error' });
    }
  };

  const handleSaveNew = async (form) => {
    try {
      await executeOperation(() => adminDataService.createEvent(parseEventForm(form)));
      await refetchEvents();
      setIsAddOpen(false);
      setToast({ message: 'Event created successfully', type: 'success' });
    } catch (error) {
      console.error('Error creating event:', error);
      setToast({ message: 'Failed to create event', type: 'error' });
    }
  };

  const handleSaveEdit = async (form) => {
    try {
      await executeOperation(() => adminDataService.updateEvent(form.id, parseEventForm(form)));
      await refetchEvents();
      setEditing(null);
      setToast({ message: 'Event updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating event:', error);
      setToast({ message: 'Failed to update event', type: 'error' });
    }
  };

  // Show loading state
  if (eventsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  // Show error state
  if (eventsError) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Error Loading Events</h3>
              <p className="text-gray-600 mb-4">Unable to load events. Please try again later.</p>
              <button 
                onClick={() => refetchEvents()} 
                className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition-colors"
              >
                Retry
              </button>
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6 space-y-2">
            <div>
              <Link to="/admin" className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-black">Manage Announcements & Events</h1>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
                <button onClick={handleLogout} className="bg-stone-100 text-black px-4 py-2 rounded-lg hover:bg-stone-200 inline-flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or description..." className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
              </div>
              <div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                  <option value="all">All Categories</option>
                  {adminCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Images</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-sm font-medium text-black">{e.title}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{e.category}</td>
                    <td className="px-4 py-3 text-sm">
                      {e.eventDate ? (() => {
                        try {
                          const date = new Date(e.eventDate);
                          if (isNaN(date.getTime())) return e.eventDate;
                          return date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });
                        } catch {
                          return e.eventDate;
                        }
                      })() : 'No date'}
                    </td>
                    <td className="px-4 py-3 text-sm">{e.imageUrls?.length || 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditing(e)} className="px-3 py-1.5 rounded-lg border border-stone-300 text-gray-700 hover:border-black w-full sm:w-auto">Edit</button>
                        <button type="button" onClick={() => setConfirmDelete(e)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:border-red-500 w-full sm:w-auto">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <AdminFooter />
      {isAddOpen && (
        <EventFormModal title="Add Entry" onClose={() => setIsAddOpen(false)} onSave={handleSaveNew} categories={adminCategories} />
      )}
      {editing && (
        <EventFormModal title="Edit Entry" initial={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} categories={adminCategories} />
      )}
      {confirmDelete && (
        <ConfirmModal title="Delete Entry" message={`Are you sure you want to delete "${confirmDelete.title}"?`} confirmText="Delete" onCancel={() => setConfirmDelete(null)} onConfirm={() => { handleDelete(confirmDelete.id); setConfirmDelete(null); }} />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EventsManager;

// Helpers & Modals
function parseEventForm(form) {
  const imageUrls = (form.imageUrls || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  
  // Format date for display - convert YYYY-MM-DD to readable format
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return {
    id: Number(form.id),
    title: form.title || 'Untitled',
    category: form.category || 'Announcement',
    eventDate: form.date || '',
    date: formatDateForDisplay(form.date), // Add formatted date for display
    description: form.description || '',
    imageUrls,
  };
}

const EventFormModal = ({ title, initial, onClose, onSave, categories }) => {
  const [form, setForm] = useState(() => {
    // Convert date to YYYY-MM-DD format for HTML5 date input
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      try {
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }
        // Try to parse the date and convert to YYYY-MM-DD
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    return {
      id: initial?.id || '',
      title: initial?.title || '',
      category: initial?.category || (categories?.[0]?.id || 'Announcement'),
      date: formatDateForInput(initial?.date || initial?.eventDate || ''),
      description: initial?.description || '',
      imageUrls: Array.isArray(initial?.imageUrls) ? initial.imageUrls.join('\n') : '',
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g., First Collab Drop!" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                {categories?.map((c) => (
                  <option key={c.id} value={c.id || c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Date</label>
              <input 
                type="date" 
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Write a short announcement or event details..." className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Image URLs (one per line or comma separated)</label>
              <textarea name="imageUrls" value={form.imageUrls} onChange={handleChange} rows={5} placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone-300 text-gray-700 hover:border-black">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmModal = ({ title, message, confirmText = 'Confirm', onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-stone-700">{message}</p>
        </div>
        <div className="p-5 pt-0 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-gray-700 hover:border-black">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

