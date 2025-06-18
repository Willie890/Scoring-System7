// Replace with this modern fetch implementation
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const API_BASE_URL = 'https://scoring-system7.onrender.com/'; // Your Render URL
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include" // Essential for cookies
    });

    if (!response.ok) throw new Error(await response.text());
    
    const { user } = await response.json();
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = user.role === "admin" 
      ? "/admin_home.html" 
      : "/user_home.html";
      
  } catch (error) {
    console.error("Login failed:", error);
    document.getElementById("loginError").textContent = 
      error.message.includes("401") 
        ? "Invalid credentials" 
        : "Login service unavailable";
  }
});





