const User = require("../models/User");

const profile = (req, res) => {
  res.render("profile");
};

const signin = (req, res) => {
  res.render("signin");
};

const signup = (req, res) => {
  res.render("signup");
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const dbResponse = await User.create({
    name: name,
    email: email,
    password: password,
  });
  res.redirect("back");
};

const createSession = (req, res) => {
  res.redirect("/");
};

const destroySession = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
};

module.exports = {
  signin,
  signup,
  profile,
  register,
  createSession,
  destroySession,
};
