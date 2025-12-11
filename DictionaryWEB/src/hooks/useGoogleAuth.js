import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "@services/googleAuthService";
import { use } from "react";

export const useGoogleAuth = (setAuthorized) => {
  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await loginWithGoogle(tokenResponse.access_token);
        if (user.status === 200) {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Login error:", error);
        setAuthorized(false);
      }
    },
    onError: () => {
      console.error("Помилка входу");
    },
    scope: 'email profile',
  });
};