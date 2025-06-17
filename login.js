import { login } from './api.js';

document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");

  try {
    const result = await login(username, password);
    if (result.success) {
      // Store user data in localStorage (or sessionStorage)
      localStorage.setItem("loggedInUser", JSON.stringify(result.user));
      // Store token if your server implements JWT
      // localStorage.setItem("token", result.token);
      
      // Redirect based on role
      window.location.href = result.user.role === "admin" 
        ? "admin_home.html" 
        : "user_home.html";
    } else {
      errorEl.textContent = result.message || "Invalid username or password";
      document.getElementById("password").value = "";
    }
  } catch (error) {
    errorEl.textContent = "Login failed. Please try again.";
    console.error("Login error:", error);
  }
});




