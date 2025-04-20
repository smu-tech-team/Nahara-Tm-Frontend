import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "ADMIN", // Default role set to "ADMIN"
  });

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Navigation instance

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validation checks for fields
    if (name === "email" && !validateEmail(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (name === "password" && !validatePassword(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          "Password must be at least 8 characters long and include letters, numbers, and special characters.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          "Password must be at least 8 characters long and include letters, numbers, and special characters.",
      }));
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:8087/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Admin registered successfully!");
        setTimeout(() => {
          navigate("/login/admin"); // Redirect to login after 2 seconds
        }, 2000); // Add delay for better UX
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 dark:bg-gray-500">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Register Admin
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="userName">
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="w-full px-4 py-2 border text-gray-800 dark:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full px-4 py-2 border text-gray-800 dark:text-gray-500 rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={`w-full px-4 py-2 border text-gray-800 dark:text-gray-500 rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-4 text-gray-600 dark:text-gray-400 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="w-full px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
          ) : (
            "Register"
          )}
        </button>
        {message && (
          <p className="mt-4 text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminRegistrationForm;
