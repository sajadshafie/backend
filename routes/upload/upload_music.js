var express = require("express");
var router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const db = require("../../db/db");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const fs = require("fs");
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "فایلی اپلود نشده است" });
    }
    const query = `INSERT INTO media(image_data) VALUES($1) RETURNING id`;
    console.log(req.file.buffer)
    const result = await db.query(query, [req.file.buffer]);
    const imageID = result.rows[0].id;
    res.status(200).json({ message: "فایل با موفقیت آپلود شد" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "مشکل فایل" });
  }
});

module.exports = router;
