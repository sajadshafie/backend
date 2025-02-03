var express = require("express");
const db = require("../../db/db");
var router = express.Router();
const multer = require("multer");
const upload = multer();

router.put("/:id", upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, email, phone_number } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const query = `UPDATE users
    SET user_name=$1,email=$2,phone_number=$3
    WHERE id=$4
    `;
    const values = [user_name, email, phone_number, id];
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({ message: `User with id:${id} update successfully` });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
