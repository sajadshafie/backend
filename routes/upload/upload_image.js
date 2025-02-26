var express = require("express");
var router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const db = require("../../db/db");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    cb(null, uuid + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "فایلی اپلود نشده است" });
    }
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const query = `INSERT INTO media (image_url) VALUES ($1) RETURNING id`;
    const result = await db.query(query, [imageUrl]);
    res.json({
      message: "اپلود موفقیت امیز بود",
      image_url: imageUrl,
      id: result.rows[0].id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "مشکل فایل" });
  }
});

module.exports = router;
// 4ab03685-5c8f-4554-89b3-7dbdd2c5562cblu-bank
// 4ab03685-5c8f-4554-89b3-7dbdd2c5562cblu-bank