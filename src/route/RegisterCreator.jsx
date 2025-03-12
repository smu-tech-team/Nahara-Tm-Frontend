import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

    if (password.length < 8 || !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(password)) {
      setError("Password must be at least 8 characters long and include letters, numbers, and special characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8087/api/creator/register", {
        blogName,
        email,
        password,
        role,
      });

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response ? error.response.data.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
            📢 Important Guidelines for <span className="font-bold text-red-600">SMUTV</span> Creators
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
            As a content creator, you play a key role in shaping public opinion. It is essential to ensure that all 
            news and information you share are **verified, accurate, and responsible**. 
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
            ❌ <span className="font-bold text-red-600">Do not</span> publish or distribute **fake news** or **unverified information**.  
            🛑 Any misleading content will be removed immediately when reported.  
            ✅ Always fact-check before posting to maintain credibility.  
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Fake news can harm individuals, damage reputations, and mislead communities. Let&apos;s work together to promote
            **truthful and impactful content**. By proceeding, you agree to uphold these standards.
          </p>
          <label className="flex items-center text-lg mt-4">
            <input
              type="checkbox"
              className="mr-3 w-5 h-5"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-gray-900 dark:text-gray-300">I agree to follow these guidelines.</span>
          </label>
          <button
            className={`mt-6 w-full py-3 text-lg rounded-lg text-white font-semibold transition ${
              agreed ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => agreed && setShowPopup(false)}
            disabled={!agreed}
          >
            Proceed
          </button>
        </div>
      </div>
    )}
    
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Register Creator</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Blog Name:</label>
            <input
              type="text"
              value={blogName}
              onChange={(e) => setBlogName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 dark:text-gray-300">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="CREATOR">Creator</option>
              {/* Add other roles here if needed */}
            </select>
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
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatorRegister;
