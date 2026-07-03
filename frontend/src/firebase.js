// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find these details in your Firebase Console under Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bg-remove-YOUR-PROJECT-ID.firebaseapp.com",
  projectId: "bg-remove-YOUR-PROJECT-ID",
  storageBucket: "bg-remove-YOUR-PROJECT-ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize other services if you need them later
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

export default app;
