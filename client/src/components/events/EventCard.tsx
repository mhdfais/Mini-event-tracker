import { Clock, MapPin, Share2, Trash2 } from 'lucide-react';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => Promise<void>;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyShareLink = (): void => {
    const link = `${window.location.origin}/share/${event.shareToken}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  };

  const isPast = new Date(event.dateTime) < new Date();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition ${
      isPast ? 'opacity-75' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex-1 pr-2">{event.title}</h3>
        <button
          onClick={() => onDelete(event._id)}
          className="text-red-500 hover:text-red-700 transition p-1"
          title="Delete event"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 text-gray-600">
          <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{formatDateTime(event.dateTime)}</span>
        </div>

        <div className="flex items-start gap-3 text-gray-600">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>
      </div>

      {event.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>
      )}

      <button
        onClick={copyShareLink}
        className="w-full bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Copy Share Link
      </button>

      {isPast && (
        <div className="mt-2 text-xs text-gray-500 text-center">Past Event</div>
      )}
    </div>
  );
}