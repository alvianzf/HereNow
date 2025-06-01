import { User, LoginCredentials, LoginResponse } from '../types/user';

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'Management',
    position: 'HR Director',
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    email: 'employee@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    profileImage: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    profileImage: 'https://i.pravatar.cc/150?img=3'
  }
] as User[];

// Simulate API call with some delay
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800);
  });
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // In a real app, we would make an API call to validate credentials
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    await simulateApiCall(null); // Simulate network delay
    throw new Error('Invalid email or password');
  }

  // For demo purposes, any password works
  // In production, you would verify the password here
  const response: LoginResponse = {
    user,
    token: 'mock-jwt-token',
  };

  return simulateApiCall(response.user);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const storedUser = localStorage.getItem('timetrack_user');
  if (!storedUser) return null;
  
  try {
    const user = JSON.parse(storedUser) as User;
    return simulateApiCall(user);
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
};

export const validateSession = async (): Promise<boolean> => {
  // In a real app, this would validate the JWT token with the server
  const storedUser = localStorage.getItem('timetrack_user');
  return simulateApiCall(!!storedUser);
};