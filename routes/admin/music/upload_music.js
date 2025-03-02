const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const db = require("../../../db/db");
const { parse: uuidParse } = require("uuid");

router.post("/", upload.none(), async (req, res) => {
  const { album_name, cover, music } = req.body;
  try {
    if (!album_name || !cover || !music) {
      return res.status(400).json({ message: "اطلاعات وارد شده اشتباه است" });
    }

    const query = `SELECT * FROM media
    WHERE id=$1 OR id=$2`;
    const coverMusicResult = await db.query(query, [cover, music]);

    const insertQuery = `INSERT INTO music_list(music_name,album_name,cover,music,time_music,likes,view)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;

    const result = await db.query(insertQuery, [
      coverMusicResult.rows[1].image_url,
      album_name,
      coverMusicResult.rows[0].image_url.replace(""),
      coverMusicResult.rows[1].image_url,
      "3:11",
      0,
      0,
    ]);
    res.json({
      message: "آپلود با موفقیت انجام شد",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "خطا در سرور" });
  }
});

module.exports = router;
