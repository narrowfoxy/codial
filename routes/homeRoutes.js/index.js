const express = require("express");
const router = express.Router();
const homeController = require("../../controller/home");

router.use("/", homeController);

module.exports = router;
