import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem("jwt") || !!sessionStorage.getItem("jwt"),
    userName: "", // Store the admin's username
  });

  const login = (token, userName, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("jwt", token); // Store token in localStorage for persistence
    } else {
      sessionStorage.setItem("jwt", token); // Store token in sessionStorage for temporary use
    }
    setAuthState({ isAuthenticated: true, userName });
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    setAuthState({ isAuthenticated: false, userName: "" });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
