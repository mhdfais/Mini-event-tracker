export interface User {
  id: string;
  email: string;
}

export interface EventUser {
  email: string;
}

export interface Event {
  _id: string;
  user: string | EventUser;
  title: string;
  dateTime: string;
  location: string;
  description?: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateEventData {
  title: string;
  dateTime: string;
  location: string;
  description?: string;
}

export type EventFilter = 'all' | 'upcoming' | 'past';

export interface ApiError {
  message: string;
  statusCode?: number;
}