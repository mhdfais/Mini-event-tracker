import { useState, useEffect } from 'react';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import SharedEvent from './components/sharedEvent/SharedEvent';
import { authAPI } from './services/api';
import type  { User } from './types';

type ViewType = 'auth' | 'dashboard' | 'shared';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewType>('auth');

  useEffect(() => {
    checkAuth();
    checkSharedRoute();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
        setView('dashboard');
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const checkSharedRoute = (): void => {
    const path = window.location.pathname;
    if (path.startsWith('/share/')) {
      setView('shared');
    }
  };

  const handleLogin = (userData: User, token: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (view === 'shared') {
    return <SharedEvent />;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
