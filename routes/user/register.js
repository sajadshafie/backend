var express = require("express");
const db = require("../../db/db"); // Correct the path to your database connection file
var router = express.Router();
const multer = require("multer");
const upload = multer();
const bcrypt = require("bcrypt");

router.post("/", upload.none(), async (req, res) => {
  try {
    const { user_name, email, phone_number, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "کلمه عبور الزامیست" });
    }
    if (!user_name) {
      return res.status(400).json({ error: "وارد کردن نام کاربری الزامیست" });
    }
    if (!phone_number) {
      return res.status(400).json({ error: "وارد کردن شماره موبایل الزامیست" });
    }
    if (
      phone_number.length > 11 ||
      phone_number.length < 11 ||
      !phone_number.startsWith("09")
    ) {
      return res.status(400).json({ error: "شماره موبایل نامعتبر" });
    }
    const includesUsers = `SELECT * FROM users
    WHERE phone_number=$1`;
    const result = await db.query(includesUsers, [phone_number]);
    if (result.rows.length) {
      return res.status(422).send({ message: "کاربر قبلا ثبت نام کرده است" });
    }

    if (!result.rows.length) {
      const hashedpassword = await bcrypt.hash(password, 10);

      const query = `INSERT INTO users (user_name, email, phone_number,password) VALUES ($1, $2, $3, $4)`;

      await db.query(query, [user_name, email, phone_number, hashedpassword]);

      res.status(200).json({ message: "User added successfully" });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
