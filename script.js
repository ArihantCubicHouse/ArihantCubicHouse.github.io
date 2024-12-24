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
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Function to load sizes for a specific gem from Firestore and display in watchlist
async function loadSizes(gemName) {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = `<p>Loading sizes for ${gemName}...</p>`;

    try {
        const sizesCollection = collection(db, "gems", gemName, "sizes");
        const querySnapshot = await getDocs(sizesCollection);
        watchlist.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const sizeName = doc.id;
            const sizeItem = document.createElement("div");
            sizeItem.classList.add("watchlist-item");
            sizeItem.innerHTML = `<div class="stock-name">${sizeName}</div>`;
            sizeItem.addEventListener("click", () => loadColors(gemName, sizeName)); // Load colors after size selection
            watchlist.appendChild(sizeItem);
        });
    } catch (error) {
        console.error(`Error loading sizes for ${gemName}:`, error);
        watchlist.innerHTML = `<p>Error loading sizes for ${gemName}. Please try again later.</p>`;
    }
}

// Function to load colors for a specific gem and size from Firestore
async function loadColors(gemName, sizeName) {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = `<p>Loading colors for ${sizeName}...</p>`;

    try {
        const colorsCollection = collection(db, "colors");
        const querySnapshot = await getDocs(colorsCollection);
        watchlist.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const colorName = doc.id;
            const colorItem = document.createElement("div");
            colorItem.classList.add("watchlist-item");
            colorItem.innerHTML = `<div class="stock-name">${colorName}</div>`;
            colorItem.addEventListener("click", () => chooseQuantity(gemName, sizeName, colorName)); // Choose quantity after color selection
            watchlist.appendChild(colorItem);
        });
    } catch (error) {
        console.error(`Error loading colors for ${sizeName}:`, error);
        watchlist.innerHTML = `<p>Error loading colors for ${sizeName}. Please try again later.</p>`;
    }
}

// Function to choose quantity after selecting a color
function chooseQuantity(gemName, sizeName, colorName) {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = `
        <p>Choose quantity for ${colorName} ${sizeName} ${gemName}:</p>
        <button id="btn-1000">1000</button>
        <button id="btn-2000">2000</button>
        <button id="btn-3000">3000</button>
        <button id="btn-5000">5000</button>
        <button id="btn-custom">Custom</button>
    `;

    // Add event listeners for the quantity buttons
    document.getElementById("btn-1000").addEventListener("click", function() {
        submitOrder(gemName, sizeName, colorName, 1000);
    });

    document.getElementById("btn-2000").addEventListener("click", function() {
        submitOrder(gemName, sizeName, colorName, 2000);
    });

    document.getElementById("btn-3000").addEventListener("click", function() {
        submitOrder(gemName, sizeName, colorName, 3000);
    });

    document.getElementById("btn-5000").addEventListener("click", function() {
        submitOrder(gemName, sizeName, colorName, 5000);
    });

    document.getElementById("btn-custom").addEventListener("click", function() {
        customQuantity(gemName, sizeName, colorName);
    });
}

// Function to handle custom quantity input
function customQuantity(gemName, sizeName, colorName) {
    const quantity = prompt("Enter custom quantity:");
    if (quantity && !isNaN(quantity) && quantity > 0) {
        submitOrder(gemName, sizeName, colorName, parseInt(quantity));
    } else {
        alert("Please enter a valid number for quantity.");
    }
}

// Function to submit the order to Firestore
async function submitOrder(gemName, sizeName, colorName, quantity) {
    try {
        const orderRef = collection(db, "orders");

        const newOrder = {
            gemName,
            sizeName,
            colorName,
            quantity,
            userId, // Assuming the user ID is stored in a cookie or session
            timestamp: new Date().toISOString(),
        };

        await addDoc(orderRef, newOrder);

        alert("Order successfully placed!");
        // Optionally, you can redirect the user to a confirmation page or clear the watchlist
        // window.location.href = "/order-confirmation";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again later.");
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
