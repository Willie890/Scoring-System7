require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
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
      useUnifiedTopology: true
    });
    
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Database connected");
    return db;
  } catch (err) {
    console.error("Connection error:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  COLLECTIONS
};
