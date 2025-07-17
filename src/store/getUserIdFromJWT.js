import { jwtDecode } from "jwt-decode";

export const getUserIdFromJWT = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded?.userId || decoded?.sub || "defaultId";
  } catch (err) {
    console.error("Failed to decode JWT", err);
    return "defaultId";
  }
};