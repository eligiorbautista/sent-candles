import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { productsData, categories } from '../data/productsData';
import { backgroundImages } from '../data/assetsData';
import BackToTop from '../components/common/BackToTop';
import ProductModal from '../components/modals/ProductModal';

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Image Container with Overlay */}
      <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              // Fallback to SVG if image fails to load
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <svg
          className="w-24 h-24 text-stone-300 group-hover:scale-110 transition-transform duration-500"
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

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Sent. Candles - Products';

    // Update meta description for this page
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Browse our collection of handcrafted scented candles. Each candle is made with natural soy wax and premium fragrance oils.',
      );
    }

    return () => {
      document.title = 'Sent. Candles';
      // Reset meta description when leaving the page
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          'Handcrafted scented candles made with natural soy wax and premium fragrance oils. Each candle tells a story and captures a sentiment.',
        );
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Filter products by category and search query
  const filteredProducts = [...productsData].reverse().filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.scent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Wait for animation
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={backgroundImages.productsHero}
            alt="Candles Background"
            className="w-full h-full object-cover filter blur-sm"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/90 backdrop-blur-sm text-amber-600 text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4" />
              Premium Collection
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 drop-shadow-sm">
            Our Candles
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Explore our curated collection of handcrafted candles. Each piece is
            made with premium soy wax and carefully selected fragrances to
            create the perfect atmosphere for any moment.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candles by name, scent, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="flex items-center gap-4">
              {/* Scroll Left Button */}
              <button
                onClick={scrollLeft}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              {/* Filter Tags Container */}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? 'bg-black text-white shadow-lg scale-105'
                        : 'bg-amber-50 text-gray-700 hover:bg-amber-100 hover:scale-105'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Scroll Right Button */}
              <button
                onClick={scrollRight}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing{' '}
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{' '}
              {filteredProducts.length === 1 ? 'candle' : 'candles'}
              {activeCategory !== 'all' && (
                <span className="ml-1">
                  in{' '}
                  <span className="font-semibold text-black">
                    {categories.find((c) => c.id === activeCategory)?.name}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 text-stone-300 mx-auto mb-4"
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
              <h3 className="text-xl font-semibold text-black mb-2">
                No candles found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Try selecting a different category'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 py-20 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We also create custom candles for special occasions. Get in touch
            with us to discuss your ideas!
          </p>
          <a
            href="/#contact"
            className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-amber-600 transition-all hover:shadow-2xl hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <BackToTop />
    </div>
  );
};

export default ProductsPage;
