import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { eventsAPI } from '../../services/api.ts';
import type { Event, EventUser } from '../../types';

export default function SharedEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadSharedEvent();
  }, []);

  const loadSharedEvent = async (): Promise<void> => {
    try {
      const shareToken = window.location.pathname.split('/share/')[1];
      if (!shareToken) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      const response = await eventsAPI.getShared(shareToken);
      setEvent(response.data);
    } catch (err) {
      setError('Event not found or link is invalid');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserEmail = (): string => {
    if (!event) return 'Unknown';
    if (typeof event.user === 'string') {
      return 'Unknown';
    }
    return (event.user as EventUser).email || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-indigo-600 text-xl">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <Calendar className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
          <p className="text-gray-600">You've been invited to this event</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Date & Time</h3>
              <p className="text-gray-600">{formatDateTime(event.dateTime)}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
              <p className="text-gray-600">{event.location}</p>
            </div>
          </div>

          {event.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <User className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Organized by</h3>
              <p className="text-gray-600">{getUserEmail()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          Want to create your own events?{' '}
          <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}