var express = require("express");
const db = require("../../db/db");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    const query = `UPDATE users
    SET active=false
    WHERE id=$1`;
    const results = await db.query(query, [id]);

    if (results.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
