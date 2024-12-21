const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// JWT Strategy (Authentication with Bearer token)
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Signup Strategy (local strategy for registering users)
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = new userModel({
          username,
          email_address: req.body.email_address,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_type: req.body.user_type,
        });

        await userModel.register(user, password); // Register user and hash password
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Login Strategy (local strategy for logging in users)
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await userModel.findByUsername(username);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const result = await user.authenticate(password);

        if (result.error) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, result.user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
