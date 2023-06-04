const express = require("express");
const signin = require("./signin.js");
const profile = require("./profile.js");
const signup = require("./signup.js");
const userController = require("../../controller/user.js");
const passport = require("passport");
const router = express.Router();

router.use("/profile", profile);
router.use("/signin", signin);
router.use("/signup", signup);
router.get("/destroy-session", userController.destroySession);
router.post(
  "/create-post",
  passport.checkAuthentication,
  userController.createPost
);
router.post(
  "/create-comment",
  passport.checkAuthentication,
  userController.createComment
);
router.get(
  "/destroy-post/:id",
  passport.checkAuthentication,
  userController.deletePost
);

router.get(
  "/destroy-comment/:id",
  passport.checkAuthentication,
  userController.deleteComment
);

router.post(
  "/update-profile",
  passport.checkAuthentication,
  userController.updateProfile
);

module.exports = router;
