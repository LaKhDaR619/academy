const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

// get All Users
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();

    // Adding Content-Range
    res.header("Content-Range", `users 0-10/${users.length}`);
    // Changing The id for the front end dashboard react-admin
    const usersObject = users.map((user) => {
      const userObject = user.toObject();
      userObject.id = user.id;
      return userObject;
    });

    res.send(usersObject);
  } catch ({ message }) {
    res.status(500).send({ message });
  }
});

// Add a User
router.post("/", async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();

    // adding the id for the front end dashboard react-admin (we have to change The Document to a normal obejct so we can append to it)
    const userObject = newUser.toObject();
    console.log(userObject);
    userObject.id = newUser.id;

    res.status(201).json(userObject);
  } catch ({ message }) {
    res.status(400).send({ message });
  }
});

// Get one User
router.get("/:id", getUser, async (req, res) => {
  // adding the id for the front end dashboard react-admin
  const userObject = res.user.toObject();
  userObject.id = res.user.id;

  res.send(userObject);
});

router.put("/:id", getUser, async (req, res) => {
  try {
    let user = res.user;
    const keys = Object.keys(req.body);

    user.name = req.body.name ? req.body.name : user.name;
    user.age = req.body.age ? req.body.age : user.age;

    const updatedUser = await user.save();

    // adding the id for the front end dashboard
    const userObject = updatedUser.toObject();
    userObject.id = updatedUser.id;

    // sending the result
    res.json(userObject);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});
// Delete a User
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User Deleted" });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

// Middleware
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.user = user;
      return next();
    } else return res.status(404).send({ message: "no User With That ID" });
  } catch ({ message }) {
    return res.status(500).send({ message });
  }
}

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

module.exports = router;
