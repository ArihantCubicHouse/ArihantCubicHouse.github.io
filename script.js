// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the 'id' cookie exists and redirect to login if it doesn't
if (!getCookie('id')) {
    window.location.href = '/login'; 
}

// Get the user ID from the `id` cookie
const userId = getCookie("id");

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
        window.location.href = "/login";
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.verified === false) {
                window.location.href = "/unverified";
            }
        } else {
            console.error("User document not found.");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error checking verification status:", error);
    }
}

// Run the verification check on page load
checkVerificationStatus();

// Function to load gems from Firestore and display in watchlist
async function loadGems() {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = "<p>Loading gems...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "gems"));
        watchlist.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const gemName = doc.id;
            const gemItem = document.createElement("div");
            gemItem.classList.add("watchlist-item");
            gemItem.innerHTML = `<div class="stock-name">${gemName}</div>`;
            gemItem.addEventListener("click", () => loadSizes(gemName)); // Add click event
            watchlist.appendChild(gemItem);
        });
    } catch (error) {
        console.error("Error loading gems:", error);
        watchlist.innerHTML = "<p>Error loading gems. Please try again later.</p>";
    }
}

// Function to load sizes and colors for a specific gem from Firestore and display in watchlist
async function loadSizes(gemName) {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = `<p>Loading sizes and colors for ${gemName}...</p>`;

    try {
        const sizesCollection = collection(db, "gems", gemName, "sizes");
        const querySnapshot = await getDocs(sizesCollection);
        watchlist.innerHTML = "";

        // Iterate through each size document
        for (const doc of querySnapshot.docs) {
            const sizeName = doc.id;
            const sizeItem = document.createElement("div");
            sizeItem.classList.add("watchlist-item");
            sizeItem.innerHTML = `<div class="stock-name">${sizeName}</div>`;

            // Now load the colors for this size
            const colorsCollection = collection(db, "colors"); // Colors are in a separate collection
            const colorsSnapshot = await getDocs(colorsCollection);
            const colors = [];

            colorsSnapshot.forEach(colorDoc => {
                const colorName = colorDoc.id; // Assuming the document ID represents the color name
                colors.push(colorName);
            });

            // Display the colors
            if (colors.length > 0) {
                const colorsContainer = document.createElement("div");
                colorsContainer.classList.add("colors-container");

                colors.forEach(color => {
                    const colorItem = document.createElement("span");
                    colorItem.classList.add("color-item");
                    colorItem.style.backgroundColor = color; // Assuming color is a valid CSS color
                    colorItem.title = color; // Display the color name on hover
                    colorsContainer.appendChild(colorItem);
                });

                sizeItem.appendChild(colorsContainer);
            } else {
                const noColors = document.createElement("div");
                noColors.innerText = "No colors available";
                sizeItem.appendChild(noColors);
            }

            // Append the size item to the watchlist
            watchlist.appendChild(sizeItem);
        }
    } catch (error) {
        console.error(`Error loading sizes for ${gemName}:`, error);
        watchlist.innerHTML = `<p>Error loading sizes for ${gemName}. Please try again later.</p>`;
    }
}

// Load gems on page load
document.addEventListener("DOMContentLoaded", loadGems);

// JavaScript for filtering the watchlist
document.getElementById('searchBar').addEventListener('input', function() {
    const filter = this.value.toUpperCase();
    const items = document.querySelectorAll('.watchlist-item');

    items.forEach(item => {
        const stockName = item.querySelector('.stock-name').textContent;
        if (stockName.toUpperCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});
