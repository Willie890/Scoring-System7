import { getScores, updateScores } from './api.js';

document.addEventListener("DOMContentLoaded", async function() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "index.html";
    return;
  }

  // Global variables for selected user/points
  window.selectedUserName = null;
  window.selectedPointValue = null;

  // Render the leaderboard table
  async function renderTable() {
    try {
      const tableBody = document.getElementById("scoreTableBody");
      if (!tableBody) return;

      const result = await getScores(/* token */);
      const scores = result || {};
      
      tableBody.innerHTML = "";

      // Create sorted array of users with their scores
      const sortedUsers = appUsers
        .map(user => ({
          name: user,
          score: scores[user] || 0
        }))
        .sort((a, b) => b.score - a.score);

      // Build the table rows
      sortedUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name}</td>
          <td class="point-buttons">
            ${[-50, -30, -20, -10, 2, 5, 10, 20, 50].map(points => `
              <button onclick="window.openReasonPopup('${user.name}', ${points})">
                ${points > 0 ? '+' + points : points}
              </button>
            `).join('')}
          </td>
          <td>${user.score}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error rendering table:", error);
    }
  }

  // Modify confirmReason to use API
  window.confirmReason = async function() {
    const presetReason = document.getElementById("presetReason").value.trim();
    const extraReason = document.getElementById("extraReason").value.trim();
    const reason = presetReason || extraReason;

    if (!reason) {
      alert("Please select or enter a reason");
      return;
    }

    try {
      await updateScores(
        selectedUserName, 
        selectedPointValue, 
        reason, 
        extraReason,
        /* token */
      );
      
      closeReasonPopup();
      renderTable();
    } catch (error) {
      alert("Failed to update scores");
      console.error("Update scores error:", error);
    }
  };

  // Initial render
  renderTable();
});






