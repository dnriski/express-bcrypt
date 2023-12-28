const express = require("express");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

//mongoose connect
mongoose
  .connect("mongodb://127.0.0.1/auth_demo")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
  });
  await user.save();
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOneAndDelete({ username });
  if (user) {
    const isMatch = bcrypt.compare(password, user.password);
    if (isMatch) {
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  res.send("Halaman admin hanya bisa di akses jika kamu login");
});

app.listen(3000, () => {
  console.log("app listening on port http://localhost:3000/");
});
