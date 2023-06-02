const express = require('express');
const router = express.Router();
const home = require("./homeRoutes.js");

router.use('/home', home);

module.exports = router;