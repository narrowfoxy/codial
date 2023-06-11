const passport = require("passport");
const googleStretegy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/User");
const env = require("./environment-managaer");

passport.use(
  new googleStretegy(env.GOOGLE_AUTH_CONFIG, async function (
    profile,
    done
  ) {
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
  })
);
