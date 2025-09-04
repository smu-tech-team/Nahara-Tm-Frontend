import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  useEffect(() => {
    /* global google */
   google.accounts.id.initialize({
      client_id: '111145431925-bjd2fcohlanp90fka3aaolb8m3tkhusa.apps.googleusercontent.com', 
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    const { credential } = response;
    const decoded = jwtDecode(credential);

    const userPayload = {
      email: decoded.email,
      fullName: decoded.name,
      googleId: decoded.sub,
      profileImage: decoded.picture,
    };

    try {
      const res = await axios.post("https://nahara-production.up.railway.app/api/auth/v1/google", userPayload);
      localStorage.setItem("token", res.data.token);
      onLoginSuccess();
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return <div id="googleSignInDiv" className="mt-4" />;
};

export default GoogleLoginButton;
