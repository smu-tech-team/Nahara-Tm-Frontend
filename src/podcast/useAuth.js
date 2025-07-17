import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const user = useMemo(() => {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  return { user, token };
};
