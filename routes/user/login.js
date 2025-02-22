const express = require("express");
const db = require("../../db/db");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "18336574",
    {
      expiresIn: "24h",
    }
  );
}
router.post("/", upload.none(), async (req, res) => {
  try {
    const { password, phone_number } = req.body;
    const query = `SELECT * FROM users
    WHERE phone_number=$1`;
    const result = await db.query(query, [phone_number]);
    const user = result.rows[0];
    if (!user) {
      return res
        .status(401)
        .json({ error: "کلمه عبور یا نام کاربری نا معتبر" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "کلمه عبور یا نام کاربری نا معتبر" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "user login successfully",
      token: token,
      user: {
        phone_number: phone_number,
        id: user.id,
        email: user.email,
        user_name: user.user_name,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
