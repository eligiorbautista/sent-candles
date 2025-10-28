import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { useAdminProducts, useAdminEvents } from '../../hooks/useAdminData.js';
import { Boxes, Star, Images, CalendarDays, ArrowRight, Cog, LogOut, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch data from Supabase
  const { data: products = [], loading: productsLoading, error: productsError } = useAdminProducts();
  const { data: events = [], loading: eventsLoading, error: eventsError } = useAdminEvents();

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

  // Derive simple statistics from Supabase data
  const stats = useMemo(() => {
    const totalProducts = products?.length || 0;
    const featuredProducts = products?.filter((p) => p.featured)?.length || 0;
    const categories = new Set(products?.map((p) => p.category || 'unknown'));
    const totalProductImages = (products || []).reduce(
      (sum, p) => sum + ((p.imageUrls && p.imageUrls.length) || 0),
      0,
    );

    const totalEvents = events?.length || 0;
    const totalEventImages = (events || []).reduce(
      (sum, e) => sum + ((e.imageUrls && e.imageUrls.length) || 0),
      0,
    );
    const latestEventDate = (() => {
      try {
        const dates = (events || [])
          .map((e) => new Date(e.eventDate))
          .filter((d) => !isNaN(d));
        if (dates.length === 0) return null;
        return new Date(Math.max.apply(null, dates));
      } catch {
        return null;
      }
    })();

    return {
      totalProducts,
      featuredProducts,
      categoryCount: categories.size,
      totalProductImages,
      totalEvents,
      totalEventImages,
      latestEventDate,
    };
  }, [products, events]);

  // Show loading state
  if (productsLoading || eventsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  // Show error state
  if (productsError || eventsError) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600">Unable to load dashboard data. Please try again later.</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <AdminHeader />
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-10 -left-10 w-[32rem] h-[32rem] bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      <section className="py-12 flex-1 relative">
        <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Link to="/admin/settings" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-300 text-gray-700 hover:border-black transition-colors">
                <Cog className="w-4 h-4" />
                Settings
              </Link>
              <button onClick={handleLogout} className="bg-stone-100 text-black px-4 py-2 rounded-lg hover:bg-stone-200 inline-flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
        </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">Total Products</span>
                <Boxes className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-black">{stats.totalProducts}</div>
              <div className="text-xs text-stone-500 mt-1">Categories: {stats.categoryCount}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">Featured Products</span>
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-black">{stats.featuredProducts}</div>
              <div className="text-xs text-stone-500 mt-1">Images: {stats.totalProductImages}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">Events</span>
                <CalendarDays className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-black">{stats.totalEvents}</div>
              <div className="text-xs text-stone-500 mt-1">
                Latest: {stats.latestEventDate ? stats.latestEventDate.toLocaleDateString() : '—'}
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">Event Photos</span>
                <Images className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-black">{stats.totalEventImages}</div>
              <div className="text-xs text-stone-500 mt-1">Across {stats.totalEvents} events</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-black">Products</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Manage</span>
              </div>
              <p className="text-gray-600 mb-4">Create, edit, and feature product entries.</p>
              <Link to="/admin/products" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow">
                Open
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-black">Announcements & Events</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Manage</span>
              </div>
              <p className="text-gray-600 mb-4">Publish announcements and event highlights.</p>
              <Link to="/admin/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow">
                Open
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-black">Content Manager</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Manage</span>
              </div>
              <p className="text-gray-600 mb-4">Manage hero, about, contact, social media, and site info.</p>
              <Link to="/admin/content" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow">
                Open
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-black">Assets Manager</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Manage</span>
              </div>
              <p className="text-gray-600 mb-4">Manage background images, logos, and other media assets.</p>
              <Link to="/admin/assets" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow">
                Open
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;


