import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthCheck } from '../hooks/useAuthCheck';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Authorization from '../Page/Authorization/Authorization.jsx';
import MainPage from '../Page/MainPage/MainPage.jsx';
import LoadingAnimation from '../components/fullScreenLoadingAnimation.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const { isAuthorized, isChecking, isServerDown, setAuthorized } = useAuthCheck();
  const isLocal = localStorage.getItem("isLocal") === "true";

  if (!isLocal && isChecking) {
    return <LoadingAnimation />
  }

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Routes>
            {!isAuthorized && !isLocal ?
              (<Route path='/*' element={<Authorization isServerDown={isServerDown} setAuthorized={setAuthorized} />} />)
              :
              (<Route path='/*' element={<MainPage />} />)
            }
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
