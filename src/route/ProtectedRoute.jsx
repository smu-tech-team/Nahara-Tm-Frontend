import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const storedToken = localStorage.getItem("token"); // Retrieve token
        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Decode token to get user role
        const decodedToken = jwtDecode(storedToken);
        setUserRole(decodedToken.roles ? decodedToken.roles[0] : null);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      setLoading(false);
    };

    checkUserRole();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Checking access...</div>;

  if (userRole !== "CREATOR") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
