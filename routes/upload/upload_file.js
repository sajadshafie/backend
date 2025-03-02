var express = require("express");
var router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const db = require("../../db/db");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    cb(null, uuid + file.originalname.replaceAll(" ", "-"));
  },
});
const upload = multer({ storage: storage, limits: { fieldSize: "10000000" } });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "فایلی اپلود نشده است" });
    }
    console.log(req.file);
    const imageUrl = `http://localhost:3000/images/${req.file.filename}`;
    const query = `INSERT INTO media (name,url,size,type) VALUES ($1,$2,$3,$4) RETURNING id`;
    const { originalname, size, mimetype } = req.file;
    const result = await db.query(query, [
      originalname,
      imageUrl,
      size,
      mimetype,
    ]);
    res.json({
      message: "اپلود موفقیت امیز بود",
      url: imageUrl,
      id: result.rows[0].id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "مشکل فایل" });
  }
});

module.exports = router;
