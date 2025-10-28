import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { eventsData, categoryColors } from '../../data/eventsData';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import EventModal from '../modals/EventModal';

eventsData.reverse();

const EventCard = ({ event, index, onClick }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const getCategoryColor = (category) => {
    return categoryColors[category] || 'bg-gray-200 text-black';
  };

  const hasImages = event.imageUrls && event.imageUrls.length > 0;

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-md overflow-hidden hover-lift group transition-all duration-700 cursor-pointer ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      {/* Event Image */}
      {hasImages && (
        <div className="relative aspect-video bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
          <img
            src={event.imageUrls[0]}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Image Counter Badge */}
          {event.imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {event.imageUrls.length} Photos
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              View Details
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getCategoryColor(event.category)}`}
          >
            {event.category}
          </span>
          <span className="text-sm text-gray-500">{event.date}</span>
        </div>
        <h3 className="text-xl font-bold text-black mb-3 group-hover:text-amber-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
};

const Events = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section id="events" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-sm font-medium">
              <Newspaper className="w-4 h-4" />
              Announcements & Events
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            Latest Announcements & Events
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay up to date with our newest products, events, and stories from
            the Sent. Candles community.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...eventsData].reverse().map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default Events;
