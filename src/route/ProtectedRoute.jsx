import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const [creatorId, setCreatorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.error("Token expired!");
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Use userId instead of creatorId
        if (decodedToken.roles?.includes("CREATOR") && decodedToken.userId) {
          setCreatorId(decodedToken.userId);
        } else {
          console.error("User is not a creator or userId is missing!");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found!");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!creatorId) {
    console.error("Redirecting: User ID missing or user unauthorized!");
    return <Navigate to="/login" replace />;
  }

  return React.isValidElement(children) ? React.cloneElement(children, { creatorId }) : children;
};

export default ProtectedRoute;
