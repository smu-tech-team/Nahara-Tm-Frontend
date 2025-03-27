import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BackGroundVideo from "../assert/854321-hd_1920_1080_24fps (1).mp4";
import HomeLogo from "../assert/SmartLogoMain.png"
import { ShieldCheck } from "lucide-react";


const CreatorLogin = () => {
  const [blogName, setBlogName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!blogName || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8087/api/creator/login", {
        blogName,
        password,
      });

      setSuccess(response.data.message);
      // Store the token (you can use local storage or cookies)
      localStorage.setItem("token", response.data.token);
      // Redirect to the dashboard or another protected route
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={BackGroundVideo}
        autoPlay
        loop
        muted
      />
      
      {/* Overlay to darken the video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0">
        <p className="text-green-600 font-semibold flex ml-[50rem] pt-5 items-center gap-2">
     <ShieldCheck size={18} />
   Secure Login Enabled 🔒
    </p></div>
      

      <div className="  p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 ease-in-out">
         <div
                onClick={() => navigate('/')} // Navigates back to the homepage
                className="cursor-pointer mx-auto w-fit text-center"
              >
                <img
                  src={HomeLogo} // Replace with the actual logo file path
                  alt="Logo"
                  className="h-16 w-16 object-contain mx-auto"
                />
                        <p className="text-white font-bold text-lg mb-2">Go Home</p>
                </div>


        <h2 className="text-2xl font-bold mb-4 text-center text-gray-400 dark:text-white">Login Creator</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="blogName" className="block text-gray-300 dark:text-gray-300">Blog Name:</label>
            <input
              type="text"
              id="blogName"
              value={blogName}
              onChange={(e) => setBlogName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-black dark:border-gray-600"
            />
          </div>
          <div className="mb-4 relative pb-5">
            <label htmlFor="password" className="block text-gray-300 dark:text-gray-300">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none flex items-center focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
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
          <Link to="/userLogin" className="text-blue-500 hover:underline dark:text-blue-400">
            Not a creator? Login as a USER here
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
