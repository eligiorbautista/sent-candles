import { X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socialLinks } from '../../data/assetsData';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showScents, setShowScents] = useState(false);

  // Prevent body scroll when modal is open and preserve scroll position
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('modal-open');
      setSelectedImageIndex(0); // Reset to first image when modal opens
      setShowScents(false); // Reset scents visibility when modal opens
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      // Cleanup on unmount
      const scrollY = document.body.style.top;
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  // Close on escape key and image navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      try {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
        if (product && product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1) {
          if (e.key === 'ArrowLeft') {
            setSelectedImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
          }
          if (e.key === 'ArrowRight') {
            setSelectedImageIndex((prev) => (prev + 1) % product.imageUrls.length);
          }
        }
      } catch (error) {
        console.error('Error in ProductModal keydown handler:', error);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, product]);

  const nextImage = () => {
    try {
      if (product && product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1) {
        setSelectedImageIndex((prev) => (prev + 1) % product.imageUrls.length);
      }
    } catch (error) {
      console.error('Error in nextImage:', error);
    }
  };

  const prevImage = () => {
    try {
      if (product && product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1) {
        setSelectedImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
      }
    } catch (error) {
      console.error('Error in prevImage:', error);
    }
  };

  // Early return with comprehensive checks
  if (!isOpen || !product || typeof product !== 'object') return null;

  // Validate required product properties
  if (!product.name || !product.category) {
    console.error('ProductModal: Missing required product properties', product);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-slideUp flex flex-col">
        {/* Header with Close Button */}
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-600 text-sm font-semibold">
                {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ') : 'Product'}
              </span>
              {product.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
              {product.name || 'Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full p-2 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
            {/* Left: Image Gallery */}
            <div className="flex flex-col">
              {/* Main Image Container */}
              <div className="relative group mb-4">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  {product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0 && product.imageUrls[selectedImageIndex] ? (
                    <img
                      src={product.imageUrls[selectedImageIndex]}
                      alt={`${product.name || 'Product'} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={(e) => {
                        try {
                          e.target.style.display = 'none';
                          if (e.target.nextElementSibling) {
                            e.target.nextElementSibling.style.display = 'flex';
                          }
                        } catch (error) {
                          console.error('Error handling image load failure:', error);
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-stone-300"
                    style={{
                      display:
                        product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0 && product.imageUrls[selectedImageIndex]
                          ? 'none'
                          : 'flex',
                    }}
                  >
                    <svg
                      className="w-32 h-32"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter Overlay */}
                {product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                    {selectedImageIndex + 1} / {product.imageUrls.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
                  {product.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-amber-500 ring-offset-1 scale-105'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${product.name || 'Product'} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          try {
                            e.target.style.display = 'none';
                          } catch (error) {
                            console.error('Error handling thumbnail load failure:', error);
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {/* Variants / Price Section */}
                {product.variants && Array.isArray(product.variants) && product.variants.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Available Options
                    </h3>
                    <div className="space-y-3">
                      {product.variants.map((variant, index) => {
                        if (!variant || typeof variant !== 'object') return null;
                        return (
                          <div
                            key={index}
                            className={`border p-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
                              variant.stockStatus === 'out-of-stock'
                                ? 'bg-gray-50 border-gray-200 opacity-60'
                                : 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-black">
                                  {variant.name || 'Option'}
                                </p>
                                {variant.stockStatus && (
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      variant.stockStatus === 'in-stock'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : variant.stockStatus === 'pre-order'
                                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                                    }`}
                                  >
                                    {variant.stockStatus === 'in-stock'
                                      ? '✓ In Stock'
                                      : variant.stockStatus === 'pre-order'
                                        ? '⏱ Pre-Order'
                                        : '✕ Out of Stock'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-2xl font-bold ${
                                variant.stockStatus === 'out-of-stock'
                                  ? 'text-gray-400'
                                  : 'text-amber-600'
                              }`}
                            >
                              ₱{variant.price || '0'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p
                      className={`font-bold text-black mb-1 ${
                        typeof product.price === 'number'
                          ? 'text-4xl'
                          : 'text-2xl'
                      }`}
                    >
                      {typeof product.price === 'number'
                        ? `₱${product.price}`
                        : product.price}
                    </p>
                  </div>
                )}

                {/* Scent Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Scent
                  </h3>
                  {product.availableScents &&
                  product.availableScents.length > 0 ? (
                    <div>
                      <button
                        onClick={() => setShowScents(!showScents)}
                        className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl text-amber-800 font-medium hover:bg-amber-100 transition-all duration-200 flex items-center gap-2"
                      >
                        Multiple Scents Available 
                        <span className="text-lg">{showScents ? '−' : '+'}</span>
                      </button>
                      {showScents && (
                        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                          {product.availableScents.map((scent, index) => (
                            <div
                              key={index}
                              className="bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-amber-800 font-medium"
                            >
                              {scent}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl text-amber-800 font-medium inline-block">
                      {product.scent}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              <div className="border-t border-stone-100 pt-6">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-black text-white text-center px-6 py-4 rounded-xl font-medium hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
