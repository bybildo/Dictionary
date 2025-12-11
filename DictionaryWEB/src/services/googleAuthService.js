import axios from "axios";

export const loginWithGoogle = async (accessToken) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await axios.post(`${apiUrl}/Login`, {
    googleToken: accessToken,
  }, { withCredentials: true });

  return response;
};