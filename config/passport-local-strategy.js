const passport = require("passport");
const User = require("../models/User");
const LocalStretegy = require("passport-local").Strategy;

// auth using passport

passport.use(
  new LocalStretegy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const userData = await User.findOne({ email: email });
        if (!userData || userData.password != password) {
          req.flash("error", "Error in auth");
          return done(null, false);
        }
        return done(null, userData);
      } catch (err) {
        req.flash("error", "error in finding user ==> passport");
        return done(err);
      }
    }
  )
);

// serializing the user which key is put in cookie

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const userData = await User.findById(id);
    return done(null, userData);
  } catch (err) {
    console.log("error in finding user ==> passport");
    return done(err);
  }
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/user/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  return next();
};

passport.checkSessionPageAndRedirect = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  return next();
};
