"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true); // 👈 New

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json(); 
        setIsAuthenticated(true);
        setUser(userData); 
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false); // ✅ Done checking
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authLoading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
