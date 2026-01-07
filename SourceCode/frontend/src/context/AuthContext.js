import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check localStorage on page reload to maintain session persistence
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      localStorage.removeItem("user");
    }
  }, []);

  // Login process: Saves user data to both state and browser storage
  const login = (userObj) => {
    setUser(userObj);
    try {
      localStorage.setItem("user", JSON.stringify(userObj));
      if (userObj && userObj.token) {
        localStorage.setItem("token", userObj.token);
      }
    } catch (e) {
      console.error("Failed to store user:", e);
    }
  };

  // Logout process: Clears user data from state and storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}