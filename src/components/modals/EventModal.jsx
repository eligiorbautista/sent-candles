import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryColors } from '../../data/eventsData';

const EventModal = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Store current scroll position
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('modal-open');
    
    return () => {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    if (event.imageUrls && event.imageUrls.length > 1) {
      setSelectedImage((prev) => (prev + 1) % event.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (event.imageUrls && event.imageUrls.length > 1) {
      setSelectedImage((prev) => (prev - 1 + event.imageUrls.length) % event.imageUrls.length);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!event) return null;

  const hasImages = event.imageUrls && event.imageUrls.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] shadow-2xl animate-slideUp relative flex flex-col">
        {/* Header with Close Button */}
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  categoryColors[event.category] || 'bg-stone-200 text-gray-900'
                }`}
              >
                {event.category}
              </span>
              <span className="text-gray-500 text-sm">{event.date}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full p-2 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Description */}
            <div className="mb-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Image Gallery */}
            {hasImages && (
              <div className="space-y-4">
                {/* Main Image Container */}
                <div className="relative group">
                  <div
                    className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
                    onClick={nextImage}
                  >
                    <img
                      src={event.imageUrls[selectedImage]}
                      alt={`${event.title} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {event.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Overlay */}
                  {event.imageUrls.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                      {selectedImage + 1} / {event.imageUrls.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {event.imageUrls.length > 1 && (
                  <div className="space-y-3">
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1 px-1">
                      {event.imageUrls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 p-0.5 ${
                            selectedImage === index
                              ? 'outline outline-2 outline-amber-500'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
