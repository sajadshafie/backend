var express = require("express");
const db = require("../../db/db"); // Correct the path to your database connection file
var router = express.Router();

// Handle GET request to /users
router.get("/", async (req, res) => {
  try {
    const query = `SELECT * FROM users 
    WHERE active=true
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
