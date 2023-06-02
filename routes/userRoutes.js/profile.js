const express = require("express");
const router = express.Router(); 
const userController = require("../../controller/user");
const passport = require("passport");

router.get("/",passport.checkAuthentication, userController.profile);

module.exports = router;
