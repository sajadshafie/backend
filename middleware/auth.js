const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.includes("Bearer"))
    return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
