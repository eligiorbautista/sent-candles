import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EventModal = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!event) return null;

  const hasImages = event.imageUrls && event.imageUrls.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full my-8 shadow-2xl animate-slideUp relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-20 bg-black/80 hover:bg-black text-white rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 sm:p-6 md:p-8 max-h-[calc(90vh-4rem)] overflow-y-auto">
          {/* Event Header */}
          {/* Event Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-sm font-semibold">
                {event.category}
              </span>
              <span className="text-gray-500 text-sm">{event.date}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {event.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Image Gallery */}
          {hasImages && (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl overflow-hidden">
                <img
                  src={event.imageUrls[selectedImage]}
                  alt={`${event.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {event.imageUrls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1 px-1">
                  {event.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${
                        selectedImage === index
                          ? 'ring-4 ring-amber-600 ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {event.imageUrls.length > 1 && (
                <div className="text-center text-sm text-gray-500">
                  {selectedImage + 1} / {event.imageUrls.length}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
