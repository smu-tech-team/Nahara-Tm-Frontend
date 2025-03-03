import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,  
  onAuthStateChanged 
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw3_0IuNz7VQY_MwN0LEUfQnlI5mxCfOw",
  authDomain: "smart-media-update.firebaseapp.com",
  projectId: "smart-media-update",
  storageBucket: "smart-media-update.firebasestorage.app",
  messagingSenderId: "292419065010",
  appId: "1:292419065010:web:5bdcd62f0430106349e5ab",
  measurementId: "G-BDXNPDTJ2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider(); 

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access Auth Context
export const useAuth = () => useContext(AuthContext);
