function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Check if the 'id' cookie exists
  if (!getCookie('id')) {
    window.location.href = '/login'; // Redirect to /
  }

// Get the user ID from the `id` cookie
const userId = getCookie("id");

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZRW7hj5jtolyXijcMLG9QBnOvUZR5I-k",
    authDomain: "arihantcubichouse1001.firebaseapp.com",
    projectId: "arihantcubichouse1001",
    storageBucket: "arihantcubichouse1001.appspot.com",
    messagingSenderId: "916505919065",
    appId: "1:916505919065:web:c9fe9cad2d0719d64ebb48",
    measurementId: "G-XKW570TWQG"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to check verification status and redirect if unverified
async function checkVerificationStatus() {
    if (!userId) {
        // If the user ID is not available, redirect to login
        window.location.href = "/login";
        return;
    }

    try {
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check if the user is verified
            if (userData.verified === false) {
                // Redirect to /unverified if the user is not verified
                window.location.href = "/unverified";
            }
        } else {
            console.error("User document not found.");
            window.location.href = "/login"; // Optional redirect if document not found
        }
    } catch (error) {
        console.error("Error checking verification status:", error);
    }
}

// Run the verification check on page load
checkVerificationStatus();
