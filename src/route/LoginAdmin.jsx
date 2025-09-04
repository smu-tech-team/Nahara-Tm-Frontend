import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BackGroundVideo from "/creator.mp4";
import HomeLogo from "/Nahara_Red[1].png";

const CreatorLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe === "true") {
      setUserName(storedUserName || "");
      setPassword(storedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://nahara-production.up.railway.app/api/admin/login", {
        userName,
        password,
      });

      setSuccess(response.data.message);
      localStorage.setItem("token", response.data.token);

      if (rememberMe) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
      }

      setTimeout(() => navigate("/admin-dashboard/management"), 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
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
      const response = await axios.get("https://nahara-production.up.railway.app/api/creator/verify-email", {
        params: { email },
      });

      if (response.data.message === "Email exists") {
        navigate(`/reset-password?email=${email}`);
      } else {
        setEmailError("Email not found. Please check and try again.");
      }
    } catch {
      setEmailError("Error verifying email. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section (Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-800 text-white py-12 px-4 sm:px-8">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer mb-8 text-center"
        >
          <img
            src={HomeLogo}
            alt="Logo"
            className="h-16 w-16 object-contain mx-auto"
          />
          <p className="text-white font-bold text-lg">Go Home</p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="userName" className="block mb-1 text-sm sm:text-base">User Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 bg-gray-700 text-white text-sm sm:text-base"
            />
          </div>
          <div className="mb-4 relative pb-5">
            <label htmlFor="password" className="block mb-1 text-sm sm:text-base">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 bg-gray-700 text-white text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-sm sm:text-base"
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
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm sm:text-base">Remember Me</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => setForgotPassword(true)}
          className="mt-4 text-blue-500 hover:underline text-sm sm:text-base"
        >
          Forgot Password?
        </button>

        {forgotPassword && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Verify Email</h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
              />
              {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setForgotPassword(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="px-4 py-2 bg-blue-800 text-white rounded text-sm sm:text-base"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 relative text-white flex justify-center items-center min-h-[500px] sm:min-h-[600px]">
      <video 
      className="absolute top-0 left-0 w-full h-full object-cover z-0" 
      src={BackGroundVideo} 
      autoPlay 
      loop 
      muted 
    />

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg">Login to continue managing your admin panel.</p>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
