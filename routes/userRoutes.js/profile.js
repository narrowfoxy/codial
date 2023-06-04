const express = require("express");
const router = express.Router(); 
const userController = require("../../controller/user");
const passport = require("passport");

router.get("/",passport.checkAuthentication, userController.profile);
router.get("/:user_id",passport.checkAuthentication, userController.customProfile);

module.exports = router;
