const express = require("express");
const router = express.Router();
const userController = require("../../controller/user");
const passport = require("passport");

router.get("/", passport.checkSessionPageAndRedirect, userController.signup);
router.post("/register", userController.register);

module.exports = router;
