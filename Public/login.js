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
  // User accounts with roles (now using array of objects instead of plain object)
  const users = [
    { username: "Jp Soutar", password: "1234", role: "admin" },
    { username: "Jp Faber", password: "1234", role: "admin" },
    { username: "user1", password: "5678", role: "user" }
  ];

  // Find user (case-insensitive username match)
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );

  if (user) {
    // Store the complete user object with role
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    // Redirect to appropriate page based on role
    window.location.href = user.role === "admin" ? "admin_home.html" : "user_home.html";
  } else {
    // Show error message in the div instead of alert
    errorEl.textContent = "Invalid username or password";
    // Clear password field
    document.getElementById("password").value = "";
  }
});



