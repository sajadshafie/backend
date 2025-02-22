var express = require("express");
const db = require("../../db/db"); // Correct the path to your database connection file
const verifyToken = require("../../middleware/auth");
var router = express.Router();

// Handle GET request to /users
router.get("/", verifyToken, async (req, res) => {
  const user = req.user;
  try {
    const query = `SELECT user_name,phone_number,email,create_at,id FROM users 
    WHERE active=true AND id=${user.id} 
    `;
    const result = await db.query(query);
    // if(!req.headers.authorization.includes('Bearer'))
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
