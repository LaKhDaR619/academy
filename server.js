require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World"));

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`server Started on port ${PORT}`));
