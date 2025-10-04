import { useState, useEffect } from 'react';
import { Plus, LogOut, Filter } from 'lucide-react';
import EventList from '../events/EventList.tsx';
import EventForm from '../events/EventForm.tsx';
import { eventsAPI } from '../../services/api.ts';
import type { User, Event, EventFilter, CreateEventData } from '../../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type ViewType = 'list' | 'create';

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [view, setView] = useState<ViewType>('list');
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<EventFilter>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async (): Promise<void> => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: CreateEventData): Promise<void> => {
    await eventsAPI.create(eventData);
    await loadEvents();
    setView('list');
  };

  const handleDeleteEvent = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        await loadEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  if (view === 'create') {
    return (
      <EventForm
        onSubmit={handleCreateEvent}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setView('create')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Event
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-6 flex-wrap">
            {(['all', 'upcoming', 'past'] as EventFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <EventList
          events={events}
          filter={filter}
          loading={loading}
          onDelete={handleDeleteEvent}
          onCreateClick={() => setView('create')}
        />
      </div>
    </div>
  );
}