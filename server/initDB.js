const { connectToDatabase, COLLECTIONS } = require('./db');

async function initializeDatabase() {
  const db = await connectToDatabase();
  
  const appUsers = [
    "Jp Faber", "Stefan van Der Merwe", "Ewan Van Eeden",
    "Frikkie Van Der Heever", "Carlo Engela", "Zingisani Mavumengwana",
    "Hlobelo Serathi", "Prins Moyo", "Patrick Mokotoamane"
  ];

  // Initialize users
  await db.collection(COLLECTIONS.USERS).insertMany([
    { username: "Jp Soutar", password: "1234", role: "admin" },
    { username: "Jp Faber", password: "1234", role: "admin" },
    { username: "user1", password: "5678", role: "user" }
  ]);

  // Initialize scores
  const scores = appUsers.map(user => ({
    user,
    points: 0
  }));
  await db.collection(COLLECTIONS.SCORES).insertMany(scores);

  console.log("Database initialized successfully");
  process.exit(0);
}

initializeDatabase().catch(error => {
  console.error("Initialization error:", error);
  process.exit(1);
});