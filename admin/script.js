// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Check if the 'admin' cookie exists
if (!getCookie("admin")) {
    // Redirect to /adminLogin if the 'admin' cookie is missing
    window.location.href = "/adminLogin";
}

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Function to load unverified users
async function loadUnverifiedUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "<p class='loading-message'>Loading unverified users...</p>";

    try {
        // Query unverified users from Firestore
        const q = query(collection(db, "users"), where("verified", "==", false));
        const querySnapshot = await getDocs(q);

        userList.innerHTML = ""; // Clear loading message

        if (querySnapshot.empty) {
            userList.innerHTML = "<p>No unverified users found.</p>";
        } else {
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const userId = doc.id; // Get document ID for updating

                const userItem = document.createElement("div");
                userItem.classList.add("user-item");

                // Display user information and create a button with an event listener
                userItem.innerHTML = `
                    <p><strong>Full Name:</strong> ${userData["Full Name"]}</p>
                    <p><strong>Phone Number:</strong> ${userData["Phone Number"]}</p>
                    <p><strong>Company Name:</strong> ${userData["company name"] || "N/A"}</p>
                `;

                const verifyButton = document.createElement("button");
                verifyButton.classList.add("verify-btn");
                verifyButton.textContent = "Verify";
                verifyButton.addEventListener("click", () => verifyUser(userId));
                
                userItem.appendChild(verifyButton);
                userList.appendChild(userItem);
            });
        }
    } catch (error) {
        console.error("Error loading unverified users:", error);
        userList.innerHTML = "<p>Error loading unverified users. Please try again later.</p>";
    }
}

// Function to verify a user
async function verifyUser(userId) {
    try {
        // Update the verified field to true in Firestore for the specific user
        await updateDoc(doc(db, "users", userId), {
            verified: true
        });

        // Reload the unverified users list to update the UI
        alert("User verified successfully!");
        loadUnverifiedUsers(); // Reload list to update UI
    } catch (error) {
        console.error("Error verifying user:", error);
        alert("Error verifying user. Please try again.");
    }
}

// Load unverified users on page load
document.addEventListener("DOMContentLoaded", loadUnverifiedUsers);
