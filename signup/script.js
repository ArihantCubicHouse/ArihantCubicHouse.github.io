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

// Function to hash password using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Function to set a session cookie without an expiration date
function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/`;
}
  
// Handle form submission
document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  // Hash the entered password
  const encryptedPassword = await hashPassword(password);

  // Retrieve the user's document from Firestore using phone as the document ID
  const userRef = doc(db, "users", phone);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();

    // Check if the hashed password matches the stored password
    if (userData.password === encryptedPassword) {
      // Set 'id' cookie to phone number and redirect to '/'
      setCookie("id", phone, 7); // Cookie expires in 7 days
      alert("Login successful!");
      window.location.href = "/";
    } else {
      alert("Incorrect password. Please try again.");
    }
  } else {
    alert("No account found with that phone number.");
  }
});
