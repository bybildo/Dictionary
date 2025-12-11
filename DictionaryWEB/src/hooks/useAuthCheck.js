import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export function useAuthCheck() {
  const [isAuthorized, setAuthorized] = useState(false);
  const [isChecking, setChecking] = useState(true);
  const [isServerDown, setServerDown] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      setChecking(true);
      try {
        await axios.get(`${apiUrl}/me`, { withCredentials: true });
        setAuthorized(true);
      } catch (error) {
        if (error.response?.status === 401) setAuthorized(false);
        else {
          setServerDown(true);
        } console.error("Auth check error:", error.response?.status || 'Server is down.');
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthorized, isChecking, isServerDown, setAuthorized };
}