import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded); // Debugging log
    return decoded; // Ensure the decoded object contains the ID
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
};
