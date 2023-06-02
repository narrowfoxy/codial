const express = require("express");
const router = express.Router(); 
const userController = require("../../controller/user");

router.get("/", userController.signup);
router.post("/register", userController.register);

module.exports = router;
