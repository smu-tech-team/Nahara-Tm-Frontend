import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      setAuthUser(storedUser);
    }
  }, []);

  const login = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
