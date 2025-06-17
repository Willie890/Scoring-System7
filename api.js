const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (token) {
    options.headers['Authorization'] = token;
  }
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Authentication
export async function login(username, password) {
  return apiCall('/login', 'POST', { username, password });
}

// Scores
export async function getScores(token) {
  return apiCall('/scores', 'GET', null, token);
}

export async function updateScores(user, pointsChange, reason, notes, token) {
  return apiCall('/scores/update', 'POST', { user, pointsChange, reason, notes }, token);
}

// History
export async function getHistory(token) {
  return apiCall('/history', 'GET', null, token);
}

// Requests
export async function getRequests(token) {
  return apiCall('/requests', 'GET', null, token);
}

export async function createRequest(requestData, token) {
  return apiCall('/requests', 'POST', requestData, token);
}

// Reset functions
export async function resetScores(token) {
  return apiCall('/reset/scores', 'POST', null, token);
}

export async function resetHistory(token) {
  return apiCall('/reset/history', 'POST', null, token);
}

export async function resetAll(token) {
  return apiCall('/reset/all', 'POST', null, token);
}