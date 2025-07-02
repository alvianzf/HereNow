import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/user';
import { loginUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  department: string;
  position: string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('timetrack_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('timetrack_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const authenticatedUser = await loginUser(email, password);
    setUser(authenticatedUser);
    localStorage.setItem('timetrack_user', JSON.stringify(authenticatedUser));
    navigate(authenticatedUser.role === 'admin' ? '/admin' : '/employee');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('timetrack_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
