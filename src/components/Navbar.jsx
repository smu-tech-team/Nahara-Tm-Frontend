import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LightLogo from "/Nahara_Logo.png";
import DarkLogo from "/Nahara_Logo2.png";
import useAuthStore from "../store/authStore";
import DefaultAvatar from "/icons8-avatar.gif";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useUI } from "../components/UIProvider "; 
import useDarkMode from "../components/useDarkMode.js"; // Adjust path if needed
import { FaFire } from "react-icons/fa";


const Navbar = ({ refreshTrigger  }) => {
  const [showRolePopup, setShowRolePopup] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const { isNavbarOpen, setIsNavbarOpen } = useUI(); 
   const [profileUpdated, setProfileUpdated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const isDarkMode = useDarkMode();

  useEffect(() => {
    console.log("Navbar refreshed due to trigger:", refreshTrigger);
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const userName = decodedToken.userName;
          const roles = decodedToken.roles || [];
  
          let endpoint = `http://localhost:8087/api/user/getUser/${userId}`; // Default for normal users
  
          if (roles.includes("CREATOR")) {
            endpoint = `http://localhost:8087/api/user/creator/${userId}`;
            setUserRole("CREATOR");
          } else if (roles.includes("ADMIN")) {
            endpoint = `http://localhost:8087/api/user/admin/${userName}`;
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
  }, [setUser, clearUser, profileUpdated]); 
  
    
  const handleRegisterClick = () => {
    setShowRolePopup(true);
    setIsNavbarOpen(false); 
  };
  
  const handleRoleSelection = (role) => {
    setShowRolePopup(false);
    setIsNavbarOpen(false); 
    navigate(role === "USER" ? "/register/reader" : "/creator/get-started");
  };
  
  const handleLoginClick = () => {
    setIsNavbarOpen(false); 
    navigate("/login");
  };
  
  const handleProfileClick = async () => {
    console.log("User Role:", userRole);
    setIsNavbarOpen(false); 
    if (userRole === "CREATOR") {
      navigate("#");
    } else if (userRole === "ADMIN") {
      navigate("/admin-dashboard/management");
    } else {
      navigate("/user-profile");
    }
  
  
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.userName;
        const userId = decodedToken.userId;
  
        let endpoint = ` http://localhost:8087/api/user/getUser/${userId}`;
        if (userRole === "CREATOR") {
          endpoint = `http://localhost:8087/api/user/creator/${userId}`;
        } else if (userRole === "ADMIN") {
          endpoint = ` http://localhost:8087/api/user/admin/${userName}`;
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
  
  const handleLogout = async () => {
    try {
        setIsNavbarOpen(false);
        const token = localStorage.getItem("token");
        if (token) {
            await axios.post(
                " http://localhost:8087/api/user/logout", 
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        clearUser();
        localStorage.removeItem("token");
        navigate("/login");
    } catch (error) {
        console.error("Failed to log out from the backend:", error.response?.data || error.message);
    }
};



  return (
    <>
<div className="w-full h-16 flex items-center justify-between bg-white dark:bg-black  rounded-lg px-4 md:px-8 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50">
<Link to="/" className="flex items-center gap-4 text-2xl font-bold">
  <img
    src={isDarkMode ? "/Nahara_Logo2.png" : "/Nahara_Logo.png"}
    className="w-36 h-36"
    alt="Nahara Logo"
  />
</Link>



    <div className="md:hidden">
        <div
          className="cursor-pointer text-gray-800 dark:text-white text-4xl"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)} 
        >
          {isNavbarOpen ? "✖" : "☰"}
        </div>
        {isNavbarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsNavbarOpen(false)} 
            ></div>

            <div className="w-full h-screen flex flex-col items-center gap-6 text-lg font-medium justify-center fixed top-16 left-0 bg-gray-500 dark:bg-slate-600 transition-all duration-500 z-50">
              <Link to="/" onClick={() => setIsNavbarOpen(false)}>Home</Link>
              <Link to="/trending" onClick={() => setIsNavbarOpen(false)}>Trending News</Link>
              
              <Link to="/popular" onClick={() => setIsNavbarOpen(false)}>Most Popular</Link>
                <Link to="/stream-songs" onClick={() => setIsNavbarOpen(false)} className="bg-blue-800 text-white py-2 px-4  rounded-md text-sm font-medium shadow-md hover:bg-blue-900 hover:scale-105 transition-transform duration-300 ease-in-out"> Listen Songs
                    </Link> 
              <Link to="/live-scores" className="font-bold border py-2 px-4 rounded-3xl bg-white text-black hover:bg-red-800" 
              onClick={() => setIsNavbarOpen(false)}><sapn className="animate-pulse">🔴</sapn>Live Scores</Link>
            {!user ? (
              <>
                <button 
                  onClick={handleLoginClick} 
                  className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-800"
                >
                  Login 👋
                </button>
                <button 
                  onClick={handleRegisterClick} 
                  className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-800"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-pink-500 p-1 animate-gradient-border">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <img
                        src={`${user.blogProfile || user.adminProfile || user.img || DefaultAvatar}?t=${new Date().getTime()}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                        onClick={handleProfileClick}
                      />
                    </div>
                  </div>
                </div>
                {userRole === "CREATOR" && (
                  <Link to="/creator-dashboard" onClick={() => setIsNavbarOpen(false)}>
                    <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-800">
                      Dashboard
                    </button>
                  </Link>
                )}
                {userRole === "ADMIN" && (
                  <Link to="/admin-dashboard/management" onClick={() => setIsNavbarOpen(false)}>
                    <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-800">
                      Admin 
                    </button>
                  </Link>
                )}

                <button onClick={handleLogout} className="py-2 px-4 rounded-3xl bg-red-800 text-white dark:bg-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
    <div className="hidden md:flex items-center gap-6 text-gray-800 dark:text-white">
        <Link
          to="/live-scores"
          className="group relative px-6 py-2 backdrop-blur-md   text-black dark:text-white font-semibold  
          transition-all duration-300 hover:bg-transparent hover:text-gray-800 flex items-center gap-2"
        >
          <span className="flex items-center gap-3">
            <span className="text-base">LIVE SCORES</span>
            <span className="relative flex items-center justify-center">
              <span className="absolute animate-pulse-smooth h-4 w-4 rounded-full bg-red-600 shadow-md"></span>
              <span className="relative h-3 w-3 rounded-full bg-red-600 border-2 shadow-md"></span>
            </span>
          </span>
        </Link>     
        <Link to="/posts?cat=hot-gist" className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2 flex items-center gap-2">
          <FaFire /> Hot Gist
        </Link>      {userRole === "CREATOR" && (
        <Link to="/creator-dashboard" className="hover:text-blue-500 transition font-bold">
          Dashboard
        </Link>
      )}
      {userRole === "ADMIN" && (
        <Link to="/admin-dashboard/management">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white dark:bg-blue-800">
            Admin 
          </button>
        </Link>
      )}
      {!user ? (
        <>
          <button onClick={handleRegisterClick} className="py-2 px-4 bg-red-600 text-white rounded-md">
            Register
          </button>
          <button onClick={handleLoginClick} className="py-2 px-4 bg-blue-800 text-white rounded-md">
            Login
          </button>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={`${user.blogProfile || user.adminProfile || user.img || DefaultAvatar}?t=${new Date().getTime()}`}
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
          <button onClick={() => handleRoleSelection("CREATOR")} className="py-2 px-4 bg-blue-800 text-white rounded-md">
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