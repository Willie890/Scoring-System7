require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase, getDb, COLLECTIONS } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database connection
connectToDatabase().then(() => {
  // Database initialized successfully
});

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  
  try {
    // Verify token logic here
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

// API Endpoints

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  
  try {
    const user = await db.collection(COLLECTIONS.USERS).findOne({
      username: username.toLowerCase(),
      password
    });
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Scores
app.get('/api/scores', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    const scores = await db.collection(COLLECTIONS.SCORES).find().toArray();
    const scoresObj = {};
    scores.forEach(score => {
      scoresObj[score.user] = score.points;
    });
    res.json(scoresObj);
  } catch (error) {
    console.error("Get scores error:", error);
    res.status(500).send("Error fetching scores");
  }
});

app.post('/api/scores/update', authenticate, async (req, res) => {
  const { user, pointsChange, reason, notes } = req.body;
  const db = getDb();
  
  try {
    // Update scores
    await db.collection(COLLECTIONS.SCORES).updateOne(
      { user },
      { $inc: { points: pointsChange } },
      { upsert: true }
    );
    
    // Add to history
    await db.collection(COLLECTIONS.HISTORY).insertOne({
      user,
      points: pointsChange,
      reason,
      notes: notes || "No additional notes",
      timestamp: new Date()
    });
    
    const updatedScores = await db.collection(COLLECTIONS.SCORES).find().toArray();
    const scoresObj = {};
    updatedScores.forEach(score => {
      scoresObj[score.user] = score.points;
    });
    
    res.json({ success: true, scores: scoresObj });
  } catch (error) {
    console.error("Update scores error:", error);
    res.status(500).json({ success: false, message: "Error updating scores" });
  }
});

// History
app.get('/api/history', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    const history = await db.collection(COLLECTIONS.HISTORY)
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    res.json(history);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).send("Error fetching history");
  }
});

// Requests
app.get('/api/requests', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    const requests = await db.collection(COLLECTIONS.REQUESTS)
      .find({ status: "pending" })
      .sort({ timestamp: -1 })
      .toArray();
    res.json(requests);
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).send("Error fetching requests");
  }
});

app.post('/api/requests', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    const result = await db.collection(COLLECTIONS.REQUESTS).insertOne({
      ...req.body,
      status: "pending",
      timestamp: new Date()
    });
    res.json({ success: true, request: result.ops[0] });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ success: false, message: "Error creating request" });
  }
});

// Reset endpoints
app.post('/api/reset/scores', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    await db.collection(COLLECTIONS.SCORES).updateMany(
      {},
      { $set: { points: 0 } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Reset scores error:", error);
    res.status(500).json({ success: false, message: "Error resetting scores" });
  }
});

app.post('/api/reset/history', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    await db.collection(COLLECTIONS.HISTORY).deleteMany({});
    res.json({ success: true });
  } catch (error) {
    console.error("Reset history error:", error);
    res.status(500).json({ success: false, message: "Error resetting history" });
  }
});

app.post('/api/reset/all', authenticate, async (req, res) => {
  const db = getDb();
  
  try {
    await Promise.all([
      db.collection(COLLECTIONS.SCORES).updateMany({}, { $set: { points: 0 } }),
      db.collection(COLLECTIONS.HISTORY).deleteMany({}),
      db.collection(COLLECTIONS.REQUESTS).deleteMany({})
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Reset all error:", error);
    res.status(500).json({ success: false, message: "Error resetting data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit();
});