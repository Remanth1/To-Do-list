import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : {};

    // Check if user exists and password matches
    if (!users[email]) {
      return { success: false, error: 'No account found with this email' };
    }

    if (users[email].password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    // Login successful
    const userData = { email, name: users[email].name };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : {};

    // Check if user already exists
    if (users[email]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Register new user
    users[email] = { name, password };
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after registration
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
