var express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const db = require("../../db/db");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const musicDir = "musics";
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir);
    }
    cb(null, musicDir);
  },
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    cb(null, uuid + file.originalname.replaceAll(" ", "-"));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: "10000000" } });

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "خطا در وارد کردن اطلاعات" });
    }
    const filepath = req.file.path;
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) {
        console.error("Error:", err);
        return;
      }

      // Get duration in seconds
      const duration = metadata.format.duration;
      console.log(`Duration: ${duration} seconds`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "خطا در سرور" });
  }
});

module.exports = router;
