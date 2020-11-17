const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  extra: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
