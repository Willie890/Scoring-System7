const { MongoClient } = require('mongodb');

// Connection URI - replace with your actual MongoDB Atlas connection string
const uri = MONGODB_URI=mongodb+srv://JpSoutar:1234@scoringsystemcluster.z3xut62.mongodb.net/pointsDB?retryWrites=true&w=majority&appName=Scoringsystemcluster;

// Database and collection names
const DB_NAME = "pointsDB";
const COLLECTIONS = {
  USERS: "users",
  SCORES: "scores",
  HISTORY: "history",
  REQUESTS: "requests"
};

let client;
let db;

async function connectToDatabase() {
  if (db) return db;
  
  try {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    db = client.db(DB_NAME);
    
    // Initialize collections if they don't exist
    await db.collection(COLLECTIONS.USERS).createIndex({ username: 1 }, { unique: true });
    await db.collection(COLLECTIONS.SCORES).createIndex({ user: 1 }, { unique: true });
    
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

module.exports = {
  connectToDatabase,
  getDb,
  closeConnection,
  COLLECTIONS
};
