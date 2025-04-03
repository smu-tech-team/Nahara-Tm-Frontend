// import { auth } from "../store/firebaseConfig"; // Ensure the correct import path
// import { onAuthStateChanged } from "firebase/auth";

// const setupAuthListener = () => {
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       const token = await user.getIdToken();
//       localStorage.setItem("firebaseToken", token);
//       console.log("Firebase token stored:", token);
//     } else {
//       localStorage.removeItem("firebaseToken");
//       console.log("User is not logged in. Token removed.");
//     }
//   });
// };

// export default setupAuthListener;
