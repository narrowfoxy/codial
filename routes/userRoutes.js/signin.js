const express = require("express");
const router = express.Router();
const userController = require("../../controller/user");
const passport = require("passport");

router.get("/", passport.checkSessionPageAndRedirect, userController.signin);

router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/user/signin",
  }),
  userController.createSession
);

module.exports = router;
