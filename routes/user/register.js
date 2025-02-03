var express = require("express");
const db = require("../../db/db"); // Correct the path to your database connection file
var router = express.Router();
const multer = require("multer");
const upload = multer();
const bcrypt = require("bcrypt");
// Handle GET request to /users
router.post("/", upload.none(), async (req, res) => {
  try {
    const { user_name, email, phone_number, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword, password, "###########");
    const query = `INSERT INTO users (user_name, email, phone_number,password) VALUES ($1, $2, $3, $4)`;

    await db.query(query, [user_name, email, phone_number, hashedpassword]);

    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
