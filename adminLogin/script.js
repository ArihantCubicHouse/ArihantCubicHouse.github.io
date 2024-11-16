// Admin password hash to match
const adminPasswordHash = "76f60710787b169963b0fd534f02cd250428195cfbd4f576cf0a26465499eeaf";

// Function to hash password using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Function to set a cookie
function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// Handle form submission
document.getElementById("admin-login-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const password = document.getElementById("admin-password").value;
  
  // Hash the entered password
  const encryptedPassword = await hashPassword(password);
  
  // Check if the hashed password matches the stored hash
  if (encryptedPassword === adminPasswordHash) {
    // Set 'admin' cookie to True and redirect to /admin
    setCookie("admin", "True");
    alert("Login successful!");
    window.location.href = "/admin";
  } else {
    document.getElementById("error-message").textContent = "Incorrect password. Please try again.";
  }
});
