const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const newUser = new User({ username, email });
      const result = await User.register(newUser, password);
      console.log(result);
      res.redirect("/listings");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
      console.log("User info:", req.user);
      res.redirect("/listings");
    }
  );
  
  

module.exports = router;
