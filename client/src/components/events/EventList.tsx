import { Calendar } from 'lucide-react';
import EventCard from './EventCard';
import type { Event, EventFilter } from '../../types';

interface EventListProps {
  events: Event[];
  filter: EventFilter;
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onCreateClick: () => void;
}

export default function EventList({ 
  events, 
  filter, 
  loading, 
  onDelete, 
  onCreateClick 
}: EventListProps) {
  const filterEvents = (): Event[] => {
    const now = new Date();
    if (filter === 'upcoming') {
      return events.filter(e => new Date(e.dateTime) >= now);
    } else if (filter === 'past') {
      return events.filter(e => new Date(e.dateTime) < now);
    }
    return events;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="text-gray-600">Loading events...</div>
      </div>
    );
  }

  const filteredEvents = filterEvents();

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
        <p className="text-gray-500 mb-6">
          {filter === 'all'
            ? 'Create your first event to get started!'
            : `No ${filter} events.`}
        </p>
        {filter === 'all' && (
          <button
            onClick={onCreateClick}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Create Event
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => (
        <EventCard key={event._id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}