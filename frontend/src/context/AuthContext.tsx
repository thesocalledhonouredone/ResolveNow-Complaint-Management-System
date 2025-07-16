import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call with different user types
      const mockUser: User = {
        id: email === 'admin@resolvenow.com' ? 'admin-1' : 'user-1',
        name: email === 'admin@resolvenow.com' ? 'Admin User' : 'John Doe',
        email,
        role: email === 'admin@resolvenow.com' ? 'admin' : 'user'
      };
      
      const mockToken = `mock-token-${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate registration API call
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'user'
      };
      
      const mockToken = `mock-token-${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};