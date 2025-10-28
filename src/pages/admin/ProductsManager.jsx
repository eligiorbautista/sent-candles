import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';
import { useAdminProducts, useAdminCategories, useAdminOperations } from '../../hooks/useAdminData.js';
import { adminDataService } from '../../services/adminDataService.js';
import { Star, Trash2, ArrowLeft, LogOut, Plus } from 'lucide-react';
import Toast from '../../components/user/common/Toast.jsx';

const ProductsManager = () => {
  const navigate = useNavigate();

  // Fetch data from Supabase
  const { data: items = [], loading: productsLoading, error: productsError, refetch: refetchProducts } = useAdminProducts();
  const { data: categories = [], loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useAdminCategories();
  const { loading: operationLoading, error: operationError, executeOperation } = useAdminOperations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState(() => (categories || []).filter((c) => c && c.id !== 'all'));
  const [infoDialog, setInfoDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmCategoryDelete, setConfirmCategoryDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoryById = useMemo(() => {
    const map = new Map();
    (localCategories || []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [localCategories]);

  const adminCategories = useMemo(() => localCategories, [localCategories]);

  // Keep localCategories in sync once categories load/refetch
  useEffect(() => {
    setLocalCategories((categories || []).filter((c) => c && c.id !== 'all'));
  }, [categories]);

  const filtered = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (featuredOnly && !p.featured) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (!q) return true;
      const hay = [p.name, p.description, p.scent, (p.availableScents || []).join(' ')].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, categoryFilter, featuredOnly]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryFilter, featuredOnly]);

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
      await executeOperation(() => adminDataService.deleteProduct(id));
      await refetchProducts();
      setConfirmDelete(null);
      setToast({ message: 'Product deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setToast({ message: 'Failed to delete product', type: 'error' });
    }
  };

  const handleSaveNew = async (form) => {
    try {
      // Check if trying to add a featured product when limit is reached
      if (form.featured) {
        const currentFeaturedCount = items.filter(p => p.featured).length;
        if (currentFeaturedCount >= 6) {
          setToast({ message: 'Maximum 6 featured products allowed. Please uncheck featured or edit an existing featured product.', type: 'error' });
          return;
        }
      }
      
      await executeOperation(() => adminDataService.createProduct(parseFormToProduct(form)));
      await refetchProducts();
      setIsAddOpen(false);
      setToast({ message: 'Product created successfully', type: 'success' });
    } catch (error) {
      console.error('Error creating product:', error);
      setToast({ message: 'Failed to create product', type: 'error' });
    }
  };

  const handleSaveEdit = async (form) => {
    try {
      // Check if trying to make a product featured when limit is reached
      if (form.featured) {
        const currentFeaturedCount = items.filter(p => p.featured).length;
        const isCurrentlyFeatured = items.find(p => p.id === form.id)?.featured;
        
        // Only check limit if this product wasn't already featured
        if (!isCurrentlyFeatured && currentFeaturedCount >= 6) {
          setToast({ message: 'Maximum 6 featured products allowed. Please uncheck featured or edit an existing featured product.', type: 'error' });
          return;
        }
      }
      
      await executeOperation(() => adminDataService.updateProduct(form.id, parseFormToProduct(form)));
      await refetchProducts();
      setEditing(null);
      setToast({ message: 'Product updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating product:', error);
      setToast({ message: 'Failed to update product', type: 'error' });
    }
  };

  const handleCategoryDelete = async (id) => {
    try {
      await executeOperation(() => adminDataService.deleteCategory(id));
      if (categoryFilter === id) setCategoryFilter('all');
      await refetchCategories();
      setToast({ message: 'Category deleted successfully', type: 'success' });
    } catch (e) {
      setToast({ message: 'Failed to delete category', type: 'error' });
    }
  };

  // Show loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </section>
        <AdminFooter />
      </div>
    );
  }

  // Show error state
  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">Unable to load products. Please try again later.</p>
              <button 
                onClick={() => refetchProducts()} 
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
              <h1 className="text-2xl md:text-3xl font-bold text-black">Manage Products</h1>
              <div className="flex items-center gap-2">
                <button onClick={() => setCategoryModalOpen(true)} className="px-4 py-2 rounded-lg border border-stone-300 text-gray-700 hover:border-black transition-colors shadow-sm">
                  Manage Categories
                </button>
                <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600 transition-colors shadow inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button onClick={handleLogout} className="bg-stone-100 text-black px-4 py-2 rounded-lg hover:bg-stone-200 inline-flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, scent, or description..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {adminCategories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700">
                <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-4 w-4" />
                Featured only
              </label>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Scent(s)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Size / Burn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Variants</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Images</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedItems.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-semibold">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">{categoryById.get(p.category) || p.category}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">
                      {Array.isArray(p.availableScents) && p.availableScents.length > 0
                        ? `${p.availableScents.length} scents`
                        : (p.scent || '—')}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">{[p.size, p.burnTime].filter(Boolean).join(' / ') || '—'}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{p.variants?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{p.imageUrls?.length || 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditing(p)} className="px-3 py-1.5 rounded-lg border border-stone-300 text-gray-700 hover:border-black w-full sm:w-auto">Edit</button>
                        <button type="button" onClick={() => setConfirmDelete(p)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:border-red-500 w-full sm:w-auto">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 space-y-4">
              {/* Mobile: Stacked layout */}
              <div className="flex flex-col sm:hidden space-y-3">
                {/* Items per page selector */}
                <div className="flex items-center justify-between">
                  <label htmlFor="itemsPerPage" className="text-sm text-stone-600">Items per page:</label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
                {/* Status */}
                <div className="text-sm text-stone-600 text-center">
                  Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} products
                </div>

                {/* Navigation buttons - mobile */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  
                  {/* Page Numbers - mobile (show fewer) */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage <= 2) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 1) {
                        pageNum = totalPages - 2 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 py-1 text-xs border rounded ${
                            currentPage === pageNum
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>

              {/* Desktop: Side by side layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="itemsPerPageDesktop" className="text-sm text-stone-600">Items per page:</label>
                    <select
                      id="itemsPerPageDesktop"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="text-sm text-stone-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} products
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers - desktop */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm border rounded ${
                            currentPage === pageNum
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <AdminFooter />

      {/* Add Product Modal */}
      {isAddOpen && (
        <ProductFormModal
          title="Add Product"
          onClose={() => setIsAddOpen(false)}
          onSave={handleSaveNew}
          categories={categories}
          products={items}
        />
      )}

      {/* Edit Product Modal */}
      {editing && (
        <ProductFormModal
          title="Edit Product"
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
          categories={adminCategories}
          products={items}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            handleDelete(confirmDelete.id);
            setConfirmDelete(null);
          }}
        />
      )}

      {/* Confirm Category Delete Modal */}
      {confirmCategoryDelete && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete the category "${confirmCategoryDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onCancel={() => setConfirmCategoryDelete(null)}
          onConfirm={() => {
            handleCategoryDelete(confirmCategoryDelete.id);
            setConfirmCategoryDelete(null);
          }}
        />
      )}

      {/* Category Manager Modal */}
      {categoryModalOpen && (
        <CategoryManagerModal
          categories={adminCategories}
          onClose={() => setCategoryModalOpen(false)}
          onDelete={async (id) => {
            const inUse = items.some((p) => p.category === id);
            if (inUse) {
              const name = categoryById.get(id) || 'this category';
              setInfoDialog({
                title: 'Cannot Delete Category',
                message: `You must delete all products under "${name}" before deleting this category.`,
              });
              return;
            }
            const categoryName = categoryById.get(id) || 'this category';
            setConfirmCategoryDelete({ id, name: categoryName });
          }}
          onAdd={async (name) => {
            const slug = name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            const id = slug || `cat_${Date.now()}`;
            if ((localCategories || []).some((c) => c.id === id || (c.name || '').toLowerCase() === name.toLowerCase().trim())) {
              setInfoDialog({
                title: 'Category Exists',
                message: `A category named "${name}" already exists. Please choose a different name.`,
              });
              return;
            }
            try {
              await executeOperation(() => adminDataService.createCategory({ slug: id, name }));
              await refetchCategories();
              setToast({ message: 'Category created successfully', type: 'success' });
            } catch (e) {
              setToast({ message: 'Failed to create category', type: 'error' });
            }
          }}
        />
      )}

      {infoDialog && (
        <InfoModal
          title={infoDialog.title}
          message={infoDialog.message}
          onClose={() => setInfoDialog(null)}
        />
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

export default ProductsManager;

// Helpers and Modal Component
function parseFormToProduct(form) {
  const imageUrls = (form.imageUrls || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  let variants = [];
  try {
    variants = form.variantsJson ? JSON.parse(form.variantsJson) : [];
    if (!Array.isArray(variants)) variants = [];
    console.log('Parsed variants from form:', variants);
  } catch (error) {
    console.error('Error parsing variants JSON:', error);
    variants = [];
  }
  let availableScents = [];
  try {
    availableScents = form.availableScents
      ? form.availableScents.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
      : [];
  } catch {
    availableScents = [];
  }

  return {
    id: Number(form.id),
    name: form.name || 'Untitled',
    description: form.description || '',
    category: form.category || 'all',
    featured: Boolean(form.featured),
    scent: form.scent || '',
    size: form.size || '',
    burnTime: form.burnTime || '',
    variants,
    imageUrls,
    availableScents,
    
  };
}

const ProductFormModal = ({ title, initial, onClose, onSave, categories, products = [] }) => {
  const [form, setForm] = useState(() => ({
    id: initial?.id || '',
    name: initial?.name || '',
    description: initial?.description || '',
    category: initial?.category || (categories?.[0]?.id || 'all'),
    featured: initial?.featured || false,
    scent: initial?.scent || '',
    availableScents: Array.isArray(initial?.availableScents) && initial.availableScents.length > 0
      ? initial.availableScents.join('\n')
      : (initial?.scent || ''),
    size: initial?.size || '',
    burnTime: initial?.burnTime || '',
    imageUrls: Array.isArray(initial?.imageUrls) ? initial.imageUrls.join('\n') : '',
    variantsJson: initial?.variants ? JSON.stringify(initial.variants, null, 2) : '[\n  {\n    "name": "Regular",\n    "price": 300,\n    "stockStatus": "in-stock"\n  },\n  {\n    "name": "Large",\n    "price": 450,\n    "stockStatus": "in-stock"\n  }\n]',
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
            <div>
              <label className="block text-sm font-medium text-black mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Honeydew Melon" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Scent</label>
              <input name="scent" value={form.scent} onChange={handleChange} placeholder="Leave blank if multiple" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Available Scents</label>
              <textarea name="availableScents" value={form.availableScents} onChange={handleChange} rows={3} placeholder={"Lavender\nGreen Tea\nCinnamon"} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm" />
              <p className="text-xs text-stone-500 mt-1">One per line or comma separated</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Short product description..." className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Size</label>
              <input name="size" value={form.size} onChange={handleChange} placeholder="e.g., 200g or Standard" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Burn Time</label>
              <input name="burnTime" value={form.burnTime} onChange={handleChange} placeholder="e.g., 10-15 hours" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Image URLs</label>
              <textarea name="imageUrls" value={form.imageUrls} onChange={handleChange} rows={5} placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm" />
              <p className="text-xs text-stone-500 mt-1">One per line or comma separated</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-black mb-1">Variants (JSON array)</label>
                <span className="text-xs text-stone-500">[{`{"name":"Regular","price":300,"stockStatus":"in-stock"}`}]</span>
              </div>
                  <textarea name="variantsJson" value={form.variantsJson} onChange={handleChange} rows={8} placeholder='JSON array format:\n[\n  {\n    "name": "Regular",\n    "price": 300,\n    "stockStatus": "in-stock"\n  },\n  {\n    "name": "Large",\n    "price": 450,\n    "stockStatus": "pre-order"\n  }\n]' className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent font-mono text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input 
                id="featured" 
                name="featured" 
                type="checkbox" 
                checked={form.featured} 
                onChange={handleChange} 
                disabled={form.featured ? false : products.filter(p => p.featured).length >= 6}
                className="h-4 w-4" 
              />
              <label htmlFor="featured" className="text-sm text-black">
                Featured
                {products.filter(p => p.featured).length >= 6 && !form.featured && (
                  <span className="text-red-500 text-xs ml-1">(Max 6 reached)</span>
                )}
              </label>
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-stone-700">{message}</p>
        </div>
        <div className="p-5 pt-0 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-gray-700 hover:border-black">Cancel</button>
          <button onClick={onConfirm} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm">
            <Trash2 className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryManagerModal = ({ categories, onClose, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-black">Manage Categories</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
            <button onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(''); } }} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600">Add</button>
          </div>
          <ul className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-black">{c.name}</span>
                <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InfoModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-stone-700">{message}</p>
        </div>
        <div className="p-5 pt-0 flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-amber-600">OK</button>
        </div>
      </div>
    </div>
  );
};


