import { useState, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const TOKEN_REFRESH_MARGIN_MS = 60 * 1000; 
function useAuth() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [suspensionEndDate, setSuspensionEndDate] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logout, setLogout] = useState("");


  const decodeToken = useCallback((jwt) => {
    try {
      const decoded = jwt_decode(jwt);
      if (decoded.suspensionEndDate) {
        setSuspensionEndDate(new Date(decoded.suspensionEndDate));
      } else {
        setSuspensionEndDate(null);
      }
      setSuspensionReason(decoded.reason || null);
      return decoded;
    } catch {
      setSuspensionEndDate(null);
      setSuspensionReason(null);
      return null;
    }
  }, []);
  const scheduleRefresh = useCallback((decoded) => {
    if (!decoded || !decoded.exp) return;

    const expiryTimeMs = decoded.exp * 1000;
    const now = Date.now();
    const timeout = expiryTimeMs - now - TOKEN_REFRESH_MARGIN_MS;

    if (timeout <= 0) {
      refreshTokens();
      return;
    }

    setTimeout(() => {
      refreshTokens();
    }, timeout);
  }, []);
  const refreshTokens = useCallback(async () => {
    if (isRefreshing || !refreshToken) return;
    setIsRefreshing(true);
    try {
      const res = await axios.post("http://localhost:8087/api/auth/refresh-token", {
        refreshToken: refreshToken,
      });
      if (res.data.accessToken && res.data.refreshToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);

        const decoded = decodeToken(res.data.accessToken);
        scheduleRefresh(decoded);
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, isRefreshing, decodeToken, scheduleRefresh, logout]);
  useEffect(() => {
    if (!accessToken) return;

    const decoded = decodeToken(accessToken);
    scheduleRefresh(decoded);
  }, [accessToken, decodeToken, scheduleRefresh]);
  return {
    accessToken,
    refreshToken,
    suspensionEndDate,
    suspensionReason,
    refreshTokens,
    setTokens: (newAccessToken, newRefreshToken) => {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
      setRefreshToken(null);
      setSuspensionEndDate(null);
      setSuspensionReason(null);
    },
  };
}

export default useAuth;
