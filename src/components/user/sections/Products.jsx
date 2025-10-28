import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '../../../hooks/useSupabaseData.js';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import ProductModal from '../modals/ProductModal';

const ProductCard = ({ product, index, onClick }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden group transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
        isVisible ? 'reveal active' : 'reveal'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Container with Overlay */}
      <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <svg
          className="w-24 h-24 text-stone-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
          style={{
            display:
              product.imageUrls && product.imageUrls.length > 0
                ? 'none'
                : 'flex',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm z-10">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <div className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm shadow-xl">
              View Details
            </div>
          </div>
        </div>

        {/* Image Count Indicator */}
        {product.imageUrls && product.imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            {product.imageUrls.length}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-black mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-amber-600 font-medium">{product.scent}</p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {product.variants && product.variants.length > 0 ? null : (
          <div className="flex items-end justify-between border-t border-stone-100 pt-4">
            <div>
              <p
                className={`font-bold text-black ${typeof product.price === 'number' ? 'text-2xl' : 'text-base'}`}
              >
                {typeof product.price === 'number'
                  ? `₱${product.price}`
                  : product.price}
              </p>
            </div>

            {/* Quick View Arrow */}
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-black transition-colors shadow-md">
              <svg
                className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Products = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch featured products from Supabase
  const { data: featuredProducts, loading, error } = useFeaturedProducts();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Wait for animation
  };

  // Show loading state
  if (loading) {
    return (
      <section id="products" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="products" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-black mb-2">Error Loading Products</h3>
            <p className="text-gray-600">Unable to load featured products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-100'
          }`}
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              Featured Collection
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            Bestsellers
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our handcrafted candles, each made with premium soy wax and
            carefully selected fragrances to enhance your living space.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {(featuredProducts || []).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-amber-600 transition-all hover:shadow-xl hover:scale-105 shadow-lg"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Products;


