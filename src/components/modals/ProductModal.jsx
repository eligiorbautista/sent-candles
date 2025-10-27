import { X, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socialLinks } from '../../data/assetsData';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showScents, setShowScents] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setSelectedImageIndex(0); // Reset to first image when modal opens
      setShowScents(false); // Reset scents visibility when modal opens
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-none sm:rounded-2xl shadow-2xl max-w-6xl w-full h-full sm:h-auto max-h-full sm:max-h-[95vh] overflow-y-auto animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-2 sm:top-4 right-2 sm:right-4 float-right z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-6 md:p-8">
          {/* Left: Image Gallery */}
          <div className="flex flex-col relative">
            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 left-4 z-10 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </div>
            )}

            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl overflow-hidden shadow-lg mb-4 flex-shrink-0">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img
                  src={product.imageUrls[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center text-stone-300"
                style={{
                  display:
                    product.imageUrls && product.imageUrls.length > 0
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

            {/* Thumbnail Gallery */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-amber-600 ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-amber-400'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1).replace('_', ' ')}
                </span>
              </div>

              {/* Product Name */}
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                {product.name}
              </h2>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variants / Price Section */}
              {product.variants && product.variants.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Available Options
                  </h3>
                  <div className="space-y-2">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className={`border p-4 rounded-lg flex items-center justify-between transition-colors ${
                          variant.stockStatus === 'out-of-stock'
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : 'bg-stone-50 border-stone-200 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-black">
                              {variant.name}
                            </p>
                            {variant.stockStatus && (
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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
                          ₱{variant.price}
                        </p>
                      </div>
                    ))}
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
                      className="bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-amber-800 font-medium hover:bg-amber-100 transition-colors"
                    >
                      Multiple Scents Available {showScents ? '−' : '+'}
                    </button>
                    {showScents && (
                      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
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
                  <div className="bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-amber-800 font-medium inline-block">
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
                className="block w-full bg-black text-white text-center px-6 py-4 rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
