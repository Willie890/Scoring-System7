import { resetScores, resetHistory, resetAll } from './api.js';

document.addEventListener("DOMContentLoaded", async function() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser.role !== "admin") {
    alert("Admin access required");
    window.location.href = "index.html";
    return;
  }

  // Modify reset functions to use API
  async function resetPoints() {
    if (!confirm("Reset ALL points to zero?")) return;
    
    try {
      await resetScores(/* token */);
      showResetMessage("Points reset successfully", "green");
    } catch (error) {
      showResetMessage("Failed to reset points", "red");
      console.error("Reset points error:", error);
    }
  }

  async function resetHistory() {
    if (!confirm("Clear ALL history? This cannot be undone.")) return;
    
    try {
      await resetHistory(/* token */);
      showResetMessage("History cleared successfully", "green");
    } catch (error) {
      showResetMessage("Failed to clear history", "red");
      console.error("Reset history error:", error);
    }
  }

  async function resetEverything() {
    if (!confirm("Reset EVERYTHING? This will:\n\n- Reset all points to zero\n- Clear all history\n- Reset all requests\n\nThis cannot be undone.")) return;
    
    try {
      await resetAll(/* token */);
      showResetMessage("Complete system reset performed", "green");
    } catch (error) {
      showResetMessage("Failed to reset system", "red");
      console.error("Reset all error:", error);
    }
  }

  // Update button event listeners
  document.getElementById("resetPointsBtn").addEventListener("click", resetPoints);
  document.getElementById("resetHistoryBtn").addEventListener("click", resetHistory);
  document.getElementById("resetAllBtn").addEventListener("click", resetEverything);
});

