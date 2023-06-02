const express = require("express");
const signin = require("./signin.js");
const profile = require("./profile.js");
const signup = require("./signup.js");
const router = express.Router();

router.use("/profile", profile);
router.use("/signin", signin);
router.use("/signup", signup);

module.exports = router;
