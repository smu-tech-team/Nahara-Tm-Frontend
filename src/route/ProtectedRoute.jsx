import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [creatorId, setCreatorId] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuspension = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8087/api/admin/creator/${userId}/suspension`);
        const { suspensionEndDate } = response.data;

        if (new Date(suspensionEndDate) > new Date()) {
          setIsSuspended(true);
        }
      } catch (error) {
        console.log("Suspension check failed or not suspended:", error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

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

        const userId = decodedToken.userId;
        if (decodedToken.roles?.includes("CREATOR") && userId) {
          setCreatorId(userId);
          checkSuspension(userId);
        } else {
          console.error("User is not a creator or userId missing!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!creatorId) {
    return <Navigate to="/login" replace />;
  }

  if (isSuspended) {
    return <Navigate to={`/suspension/creator/${creatorId}`} replace />;
  }

  return React.isValidElement(children)
    ? React.cloneElement(children, { creatorId })
    : children;
};

export default ProtectedRoute;
