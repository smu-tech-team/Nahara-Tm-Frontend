import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import creatorImage from "/Mobile-login.jpg";
import { motion } from "framer-motion";
import GoogleLoginButton from "../components/GoogleLoginButton";

const CreatorRegister = () => {
  const [blogName, setBlogName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("CREATOR");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to the guidelines before registering.");
      return;
    }

    if (!blogName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (password.length < 8 || !passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include letters, numbers, and symbols.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8087/api/creator/register",
        { blogName, email, password, role }
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 py-6">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              📢 Creator Guidelines for <span className="text-red-600">NAHARA</span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              ✅ Ensure content is <strong>factual</strong>.  
              ❌ Avoid fake news.  
              🛑 Violations will lead to removal.  
              💡 Build a trusted creator space.
            </p>
            <label className="flex items-center mt-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                className="mr-3 w-5 h-5"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I agree to follow these guidelines.
            </label>
            <button
              onClick={() => agreed && setShowPopup(false)}
              disabled={!agreed}
              className={`w-full py-3 text-lg rounded-lg font-semibold transition ${
                agreed
                  ? "bg-blue-800 hover:bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-6 order-1 md:order-2"
        >
          <img
            src={creatorImage}
            alt="Content Creator"
            className="w-[90%] md:w-[400px] rounded-2xl shadow-xl"
          />
          <div>
            <h3 className=" section-title">
              Empower Your Voice
            </h3>
            <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Join thousands of creators sharing impactful stories. Grow your brand and inspire change with every post.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Register as Creator
          </h2>
          {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-3 text-center">{success}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Creator Name or Blog Name</label>
              <input
                type="text"
                value={blogName}
                onChange={(e) => setBlogName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer text-gray-500 pt-5 dark:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="CREATOR">Creator</option>
              </select>
            </div>
            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <Link
                  to="/termsAndConditions"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {isLoading ? <span className="animate-spin">⏳</span> : "Register"}
            </button>
          </form>
        </motion.div>
        {/* <div className="text-center">
          <p className="text-white my-4">Or continue with</p>
         <GoogleLoginButton onLoginSuccess={() => navigate("/")} />
          </div> */}
      </div>
    </div>
  );
};

export default CreatorRegister;
