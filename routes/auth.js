const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRouter = express.Router();

authRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.status(201).json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

authRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "An internal error occurred" });
    }

    if (!user) {
      return res.status(400).json({ error: info.message });
    }

    // Successful login
    req.login(user, { session: false }, async (loginError) => {
      if (loginError) {
        console.error("Login Processing Error:", loginError);
        return next(loginError);
      }

      const body = { _id: user._id, username: user.username };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ token });
    });
  })(req, res, next);
});

module.exports = authRouter;
