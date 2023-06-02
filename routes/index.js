const express = require('express');
const router = express.Router();
const home = require("./homeRoutes.js");
const user = require("./userRoutes.js");
router.use('/', home);
router.use('/user', user);

module.exports = router;