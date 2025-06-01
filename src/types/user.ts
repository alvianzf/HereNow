export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeoFence {
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}