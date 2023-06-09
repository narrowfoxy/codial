const passport = require("passport");
const googleStretegy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/User");

passport.use(
  new googleStretegy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/user/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        var user = await User.findOne({ email: profile.emails[0].value });
        console.log(user);
        if (user) {
          return done(null, user);
        } else {
          user = await User.create({
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            name: profile.displayName,
          });
          console.log(user);
          return done(null, user);
        }
      } catch (err) {
        console.log("error in g-auth", err);
        return done(err, false);
      }
    }
  )
);
