import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assert/SmartLogoMain.png";
import useAuthStore from "../store/authStore";
import DefaultAvatar from "../assert/icons8-avatar.gif";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [showRolePopup, setShowRolePopup] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const roles = decodedToken.roles || [];
  
          let endpoint = `http://localhost:8087/api/user/getUser/${userId}`; // Default for normal users
  
          if (roles.includes("CREATOR")) {
            endpoint = `http://localhost:8087/api/user/creator/${userId}`;
            setUserRole("CREATOR");
          } else if (roles.includes("ADMIN")) {
            endpoint = `http://localhost:8087/api/user/admin/${userId}`;
            setUserRole("ADMIN");
          } else {
            setUserRole("USER"); // Default role
          }
  
          console.log("Fetching profile from:", endpoint);
  
          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error.response?.data || error.message);
        clearUser();
      }
    };
  
    fetchUserProfile();
  }, [setUser, clearUser, profileUpdated]); // ✅ Ensure `profileUpdated` triggers a refresh
  
    
  const handleRegisterClick = () => setShowRolePopup(true);
  const handleRoleSelection = (role) => {
    setShowRolePopup(false);
    navigate(role === "USER" ? "/register/reader" : "/register/creator");
  };

  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = async () => {
    console.log("User Role:", userRole);
  
    if (userRole === "CREATOR") {
      navigate("/creator-profile");
    } else if (userRole === "ADMIN") {
      navigate("/admin-profile");
    } else {
      navigate("/profile");
    }
  
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
  
        let endpoint = ` http://localhost:8087/api/user/getUser/${userId}`;
        if (userRole === "CREATOR") {
          endpoint = `http://localhost:8087/api/user/creator/${userId}`;
        } else if (userRole === "ADMIN") {
          endpoint = ` http://localhost:8087/api/user/admin/${userId}`;
        }
  
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setUser(response.data);
        setProfileUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error.response?.data || error.message);
    }
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
                  <button onClick={handleLoginClick} className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600">
                    Login 👋
                  </button>
                  <button onClick={handleRegisterClick} className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                    Register
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {/* ✅ PROFILE IMAGE */}
                  <img
                    src={`${user.blogProfile || user.adminProfile || user.img || DefaultAvatar}?t=${new Date().getTime()}`}
  alt="Profile"
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={handleProfileClick}
                  />

                  {/* ✅ SHOW DASHBOARD BASED ON ROLE */}
                  {userRole === "CREATOR" && (
                    <Link to="/creator-dashboard">
                      <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600">
                        View Dashboard
                      </button>
                    </Link>
                  )}
                  {userRole === "ADMIN" && (
                    <Link to="/admin-dashboard">
                      <button className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                        View Admin Dashboard
                      </button>
                    </Link>
                  )}

                  <button onClick={handleLogout} className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ DESKTOP NAVBAR */}
        <div className="hidden md:flex items-center gap-8 text-gray-800 dark:text-white">
          <Link to="/trending">Trending News</Link>
          <Link to="/popular">Most Popular</Link>

          {/* ✅ SHOW DASHBOARD BASED ON ROLE */}
          {userRole === "CREATOR" && (
            <Link to="/creator-dashboard">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-600">
                View Dashboard
              </button>
            </Link>
          )}
          {userRole === "ADMIN" && (
            <Link to="/admin-dashboard">
              <button className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                View Admin Dashboard
              </button>
            </Link>
          )}

          {/* ✅ SHOW LOGIN/REGISTER OR USER MENU */}
          {!user ? (
            <>
              <button onClick={handleRegisterClick} className="py-2 px-4 bg-red-600 text-white rounded-md">
                Register
              </button>
              <button onClick={handleLoginClick} className="py-2 px-4 bg-blue-600 text-white rounded-md">
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* ✅ PROFILE IMAGE */}
              <img
                src={user.blogProfile || DefaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />
              <button onClick={handleLogout} className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ ROLE SELECTION POPUP */}
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
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
