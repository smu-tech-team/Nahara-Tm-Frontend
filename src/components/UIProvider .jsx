import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // Shared navbar statez

  return (
    <UIContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext); // Custom hook for accessing the context
