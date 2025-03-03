import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assert/SmartLogoMain.png";
import useAuthStore from "../store/authStore";
import DefaultAvatar from "../assert/icons8-avatar.gif"; // Renamed to be clearer
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [showRolePopup, setShowRolePopup] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;

          const response = await axios.get(`http://localhost:8087/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(response.data);
          console.log("User profile:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error.response?.data || error.message);
        clearUser();
      }
    };

    fetchUserProfile();
  }, [setUser, clearUser, profileUpdated]);

  const handleRegisterClick = () => {
    setShowRolePopup(true);
  };

  const handleRoleSelection = (role) => {
    setShowRolePopup(false);
    navigate(role === "USER" ? "/register/reader" : "/register/creator");
  };

  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = () => {
    navigate("/profile");
    setProfileUpdated((prev) => !prev);
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between bg-white dark:bg-black px-4 md:px-8 border-b border-gray-300 dark:border-gray-700 sticky">
        {/* ✅ LOGO */}
        <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
          <img src={Logo} className="w-16 h-16" alt="SMUTV Logo" />
          <span className="text-gray-800 dark:text-white">SMUTV.</span>
        </Link>

        {/* ✅ MOBILE MENU */}
        <div className="md:hidden">
          <div
            className="cursor-pointer text-gray-800 dark:text-white text-4xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </div>
          {isOpen && (
            <div className="w-full h-screen flex flex-col items-center gap-6 text-lg font-medium justify-center absolute top-16 left-0 bg-gray-300 dark:bg-slate-600 transition-all duration-500">
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/trending" onClick={() => setIsOpen(false)}>Trending News</Link>
              <Link to="/popular" onClick={() => setIsOpen(false)}>Most Popular</Link>
              <Link to="/about" onClick={() => setIsOpen(false)}>About us</Link>

              {/* ✅ SHOW REGISTER & LOGIN IF NO USER */}
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600"
                  >
                    Login 👋
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600"
                  >
                    Register
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {/* ✅ REPLACE AVATAR WITH BLOG IMAGE IF AVAILABLE */}
                  <img
                    src={user.blogImage || DefaultAvatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={handleProfileClick}
                  />

                  {/* ✅ ONLY SHOW "VIEW DASHBOARD" FOR CREATORS */}
                <Link to="/creator-dashboard">
                 <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600 dark:text-white">
                View Dashboard
              </button>
              </Link>


                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ DESKTOP NAVBAR */}
        <div className="hidden md:flex items-center gap-8 text-gray-800 dark:text-white">
          <Link to="/">Home</Link>
          <Link to="/trending">Trending News</Link>
          <Link to="/popular">Most Popular</Link>

          {/* ✅ SHOW "VIEW DASHBOARD" BUTTON FOR CREATORS ONLY */}
            <Link to="/creator-dashboard">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600">
                View Dashboard
              </button>
            </Link>

          {/* ✅ SHOW LOGIN/REGISTER OR USER MENU */}
          {!user ? (
            <>
              <button
                onClick={handleRegisterClick}
                className="py-2 px-4 bg-red-600 text-white rounded-md"
              >
                Register
              </button>
              <button
                onClick={handleLoginClick}
                className="py-2 px-4 bg-blue-600 text-white rounded-md"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* ✅ REPLACE AVATAR WITH BLOG IMAGE IF AVAILABLE */}
              <img
                src={user.blogImage || DefaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />

              {/* ✅ REMOVED EMAIL FROM NAVBAR */}
              
              <button
                onClick={handleLogout}
                className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ROLE SELECTION POPUP */}
      {showRolePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Select Your Role
            </h2>
            <div className="flex justify-around mt-4">
              <button onClick={() => handleRoleSelection("USER")} className="py-2 px-4 bg-green-500 text-white rounded-md">
                USER
              </button>
              <button onClick={() => handleRoleSelection("CREATOR")} className="py-2 px-4 bg-purple-500 text-white rounded-md">
                CREATOR
              </button>
            </div>
            <button onClick={() => setShowRolePopup(false)} className="mt-4 w-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
