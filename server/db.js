require('dotenv').config();
const { MongoClient } = require('mongodb');

// Correct connection string format
const uri = process.env.MONGODB_URI || "mongodb+srv://JpSoutar:1234@scoringsystemcluster.z3xut62.mongodb.net/pointsDB?retryWrites=true&w=majority&appName=Scoringsystemcluster";

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
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    await client.connect();
    db = client.db(DB_NAME);
    
    // Verify connection
    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");
    
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
  COLLECTIONS
};
