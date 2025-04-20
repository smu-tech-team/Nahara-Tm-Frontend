// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBw3_0IuNz7VQY_MwN0LEUfQnlI5mxCfOw",
    authDomain: "smart-media-update.firebaseapp.com",
    projectId: "smart-media-update",
    storageBucket: "smart-media-update.firebasestorage.app",
    messagingSenderId: "292419065010",
    appId: "1:292419065010:web:5bdcd62f0430106349e5ab",
    measurementId: "G-BDXNPDTJ2B"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
