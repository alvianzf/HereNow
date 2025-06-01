import { User } from '../types/user';

// Mock users for demo purposes
const mockUsers: User[] = [
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
  },
  {
    id: '4',
    email: 'robert@example.com',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'employee',
    department: 'Sales',
    position: 'Sales Representative',
    profileImage: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    email: 'emily@example.com',
    firstName: 'Emily',
    lastName: 'Williams',
    role: 'employee',
    department: 'Customer Support',
    position: 'Support Specialist',
    profileImage: 'https://i.pravatar.cc/150?img=5'
  }
];

// Simulate API call with some delay
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800);
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return simulateApiCall([...mockUsers]);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = mockUsers.find((u) => u.id === id);
  return simulateApiCall(user || null);
};

export const getEmployees = async (): Promise<User[]> => {
  const employees = mockUsers.filter((u) => u.role === 'employee');
  return simulateApiCall(employees);
};