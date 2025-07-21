import { BACKEND_URL } from "../config/config";
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
  updateUserProfile: (updatedData: Partial<User>) => Promise<void>;
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

  const fetchProfile = async (_userId: string, role: "admin" | "citizen", token: string) => {
    try {
      const endpoint = role === "admin" ? `admin` : `citizen`;
      const response = await fetch(`${BACKEND_URL}/api/v1/${endpoint}/issue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setUser(result);
        localStorage.setItem("auth_user", JSON.stringify(result));
      } else {
        console.error("Failed to fetch profile:", result.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // ✅ Fetch fresh user profile from server
        fetchProfile(parsedUser.id, parsedUser.role, storedToken);

      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("auth_user"); // Clean invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "citizen" | "admin", adminAccessCode?: string) => {
    setIsLoading(true);
    try {
      const endpoint = role === "admin" ? "signin/admin" : "signin/citizen";

      const body: any = { email, password };
      if (role === "admin" && adminAccessCode) {
        body.adminAccessCode = adminAccessCode;
      }

      const response = await fetch(`${BACKEND_URL}/api/v1/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log("Login API response:", result);

      if (!response.ok || !result.token || !result.user) {
        console.error("Invalid login response:", result);
        alert(result.message || "Login failed. Please check your credentials.");
        return false;
      }

      const authUser: User = {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName || "Guest",
        role: result.user.role,
        phonenumber: result.user.phonenumber || "",
        department: result.user.department || "",
        adminAccessCode: result.user.adminAccessCode || "",
      };

      setToken(result.token);
      setUser(authUser);

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      
      console.log("Auth User After Login:", authUser);

      return true;

    } catch (error) {
      console.error("Login Error:", error);
      return false;

    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: "citizen" | "admin") => {
    setIsLoading(true);
    try {
      const endpoint = role === "admin" ? "signup/admin" : "signup/citizen";

      const response = await fetch(`${BACKEND_URL}/api/v1/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registration failed");

      setToken(result.token);
      setUser(result.user);

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.user));

      // Optionally log in user after sign-up
      // await login(userData.email, userData.password, role, userData.adminAccessCode);
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

  const updateUserProfile = async (updatedData: Partial<User>) => {
    setIsLoading(true);
    if (!token || !user) return;
  
    try {
      const endpoint = user.role === "admin" 
        ? `admin/${user.id}` 
        : `citizen/${user.id}`;
  
      const response = await fetch(`${BACKEND_URL}/api/v1/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }
  
      // ✅ Update local state and storage
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
  
      return result;

    } catch (error) {
      console.error("Update profile error:", error);
      throw error;

    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUserProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
