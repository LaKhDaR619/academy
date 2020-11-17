const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

let refreshTokens = [];

router.post("/login", (req, res) => {
  // Authencticate User

  const username = req.body.username;
  const user = { username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

module.exports = router;
