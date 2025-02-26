const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const db = require("../../db/db");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT image_data FROM media WHERE id=$1`;
    const result = await db.query(query, [id]);
    console.log(result.rows[0]);
    if (result.rows.length > 0) {
      res.setHeader("Content-Type", "image/jpeg");
      res.send({
        message: "دریافت عکس موفقیت امیز",
        image: result.rows[0].image_data,
      });
    } else {
      res.status(404).send("Image not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "مشکل فایل" });
  }
});

module.exports = router;
