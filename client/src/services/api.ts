import axios from "axios";
import type { AxiosResponse } from "axios";
import type { AuthResponse, Event, CreateEventData, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);


  ////-------- auth api's
export const authAPI = {
  register: (
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> => {
    return api.post("/auth/register", { email, password });
  },

 
  login: (
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> => {
    return api.post("/auth/login", { email, password });
  },

 
  getMe: (): Promise<AxiosResponse<User>> => {
    return api.get("/auth/me");
  },
};


/////--------- event api's
export const eventsAPI = {
  create: (eventData: CreateEventData): Promise<AxiosResponse<Event>> => {
    return api.post("/events", eventData);
  },

  getAll: (): Promise<AxiosResponse<Event[]>> => {
    return api.get("/events");
  },

 
  getOne: (id: string): Promise<AxiosResponse<Event>> => {
    return api.get(`/events/${id}`);
  },

 
  update: (
    id: string,
    eventData: Partial<CreateEventData>
  ): Promise<AxiosResponse<Event>> => {
    return api.put(`/events/${id}`, eventData);
  },


  delete: (id: string): Promise<AxiosResponse<{ message: string }>> => {
    return api.delete(`/events/${id}`);
  },

 
  getShared: (shareToken: string): Promise<AxiosResponse<Event>> => {
    return api.get(`/events/share/${shareToken}`);
  },
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};


export const getToken = (): string | null => {
  return localStorage.getItem("token");
};


export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};


export const clearAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


export const storeAuth = (token: string, user: User): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export default api;
