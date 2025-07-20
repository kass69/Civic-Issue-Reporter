import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "citizen" | "admin";
  phonenumber?: string;
  department?: string;
  adminAccessCode?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: "citizen" | "admin", adminAccessCode?: string) => Promise<void>;
  register: (userData: any, role: "citizen" | "admin") => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "citizen" | "admin", adminAccessCode?: string) => {
    setIsLoading(true);
    try {
      const endpoint = role === "admin" ? "signin/admin" : "signin/user";

      const body: any = { email, password };
      if (role === "admin" && adminAccessCode) {
        body.adminAccessCode = adminAccessCode;
      }

      const response = await fetch(`http://localhost:5000/api/v1/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed");

      const authUser: User = {
        id: result.user?._id,
        email: result.user?.email,
        fullName: result.user?.fullName,
        role,
        phonenumber: result.user?.phonenumber,
        department: result.user?.department,
        adminAccessCode: result.user?.adminAccessCode
      };

      setToken(result.token);
      setUser(result.user);
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      
    } catch (error) {
      console.error("Login Error:", error);
      throw error;

    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: "citizen" | "admin") => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/signup/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registration failed");

      // Optionally log in user after sign-up
      await login(userData.email, userData.password, role, userData.adminAccessCode);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};





/*
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'citizen' | 'admin';
  phone?: string;
  department?: string;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: 'citizen' | 'admin') => Promise<void>;
  register: (userData: any, role: 'citizen' | 'admin') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'citizen' | 'admin') => {
    setIsLoading(true);
    try {
      // Mock API call - replace with your actual API endpoint
      const response = await mockLoginAPI(email, password, role);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: 'citizen' | 'admin') => {
    setIsLoading(true);
    try {
      // Mock API call - replace with your actual API endpoint
      const response = await mockRegisterAPI(userData, role);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock API functions - replace with your actual API calls
const mockLoginAPI = async (email: string, password: string, role: 'citizen' | 'admin') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'admin@test.com' && password === 'admin123' && role === 'admin') {
    return {
      token: 'mock-jwt-token-admin-' + Date.now(),
      user: {
        id: '1',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
        department: 'Public Works',
        employeeId: 'EMP001'
      }
    };
  } else if (email === 'citizen@test.com' && password === 'citizen123' && role === 'citizen') {
    return {
      token: 'mock-jwt-token-citizen-' + Date.now(),
      user: {
        id: '2',
        email: 'citizen@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'citizen' as const,
        phone: '+1234567890'
      }
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

const mockRegisterAPI = async (userData: any, role: 'citizen' | 'admin') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user creation
  const newUser = {
    id: 'user-' + Date.now(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role,
    phone: userData.phone,
    ...(role === 'admin' && {
      department: userData.department,
      employeeId: userData.employeeId
    })
  };

  return {
    token: `mock-jwt-token-${role}-` + Date.now(),
    user: newUser
  };
};
*/