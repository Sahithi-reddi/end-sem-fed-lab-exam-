import React, { useRef, useEffect } from 'react';
import { EventItem } from '../types';
import { Calendar, MapPin, Tag } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  isBooked: boolean;
  onBook: (id: string) => void;
  logRender: (message: string) => void;
}

// Wrapped in React.memo to prevent re-renders if props don't change
const EventCard: React.FC<EventCardProps> = React.memo(({ event, isBooked, onBook, logRender }) => {
  const renderCount = useRef(0);
  
  // This side effect runs on every render of this specific component instance
  renderCount.current += 1;
  const message = `EventCard [${event.id}] rendered. (Count: ${renderCount.current})`;
  
  // We log immediately during render phase to catch it, but using a timeout/effect 
  // to avoid side-effects during render is often cleaner. 
  // For this demo, we'll log via the prop in an effect.
  useEffect(() => {
    logRender(message);
    console.log(`%c ${message}`, 'color: #4ade80; font-weight: bold;');
  });

  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500 flex flex-col h-full flash-update">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-blue-600/90 text-xs font-semibold rounded-md text-white backdrop-blur-sm">
            ${event.price}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-medium uppercase tracking-wide">
          <Tag size={12} />
          <span>{event.category}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={14} className="mr-2" />
            {event.date}
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={14} className="mr-2" />
            {event.location}
          </div>
        </div>

        <button
          onClick={() => onBook(event.id)}
          disabled={isBooked}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${isBooked 
              ? 'bg-green-600/20 text-green-500 cursor-not-allowed border border-green-600/30' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 active:scale-95'
            }`}
        >
          {isBooked ? (
            <>Booked ✓</>
          ) : (
            <>Book Event</>
          )}
        </button>
      </div>
      
      {/* Visual Render Counter for Demo Purposes */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-[10px] text-gray-300 px-2 py-1 rounded border border-gray-600">
        Renders: <span className="text-yellow-400 font-bold">{renderCount.current}</span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
    // Custom comparison (optional, but good for verifying React.memo behavior explicitly)
    // React.memo does a shallow comparison by default.
    // If onBook reference changes, this returns false, causing re-render.
    // If onBook reference is stable (via useCallback), this returns true (if other props are stable), preventing re-render.
    return (
        prevProps.event.id === nextProps.event.id &&
        prevProps.isBooked === nextProps.isBooked &&
        prevProps.onBook === nextProps.onBook // This is the key check for useCallback
    );
});

export default EventCard;