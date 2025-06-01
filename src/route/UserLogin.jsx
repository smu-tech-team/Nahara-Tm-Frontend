import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BackGroundVideo from "/backgroundvide.mp4";
import HomeLogo from "/Nahara_Red[1].png";
import { ShieldCheckIcon } from "lucide-react";
import { getToken, getMessaging } from "firebase/messaging";
import { messaging } from "../store/firebaseConfig.js";


const UserLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    let fcmToken = null;

try {

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey: "BEcLsH1CqbjXLt-JYZQsrnJZO8zAsbCt7AY2YgjsvmBZhJM4dW0fvpQ7NfT6oW4OWOKOEp6nWdz4HpChUiH74ns",
        serviceWorkerRegistration: registration, 
      });

      if (token) {
        console.log('FCM Token:', token);
      } else {
        console.log('No FCM token available');
      }
    } catch (error) {
      console.error('Error during FCM token generation:', error);
    }
  } else {
    console.log('Notification permission denied');
  }
} catch (error) {
  console.error('Error during notification permission or service worker registration:', error);
}
 

    try {
      const requestData = { userName, password };
      if (fcmToken) requestData.fcmToken = fcmToken;

      const response = await axios.post("http://localhost:8087/api/user/login", requestData, {
        headers: { "Accept": "application/json" },
      });

      if (response.data && typeof response.data === "object") {
        setSuccess(response.data.message);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => navigate("/"), 2000);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8087/api/user/verify-email`, {
        params: { email }
      });

      if (response.data.message === "Email exists") {
        navigate(`/user-reset-password?email=${email}`);
      } else {
        setEmailError("Email not found. Please check and try again.");
      }
    } catch (error) {
      setEmailError("Error verifying email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={BackGroundVideo}
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0">
        <p className="text-green-600 font-semibold flex ml-[50rem] pt-5 items-center gap-2">
          <ShieldCheckIcon size={18} />
          Secure Login Enabled 🔒
        </p>
      </div>
      <div className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer mx-auto w-fit text-center"
        >
          <img
            src={HomeLogo}
            alt="Logo"
            className="h-32 w-32 object-contain mx-auto text-white"
          />
          <p className="text-white font-bold text-lg mb-2">Go Home</p>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center text-white dark:text-gray-300">WELCOME BACK READER</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-300 dark:text-gray-300">User Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="mb-4 relative pb-5">
            <label htmlFor="password" className="block text-gray-300 dark:text-gray-300">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none flex items-center focus:ring-2 text-black focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-gray-300 cursor-pointer">Remember Me</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setForgotPassword(true)} className="text-blue-500 hover:underline">Forgot Password?</button>
        </div>

        {forgotPassword && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold text-gray-800 mb-4"><span className="font-bold text-blue-500 animate-pulse">Welcome!</span> Kindly verify email</h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => setForgotPassword(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button onClick={handleForgotPassword} className="px-4 py-2 bg-blue-800 text-white rounded">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
