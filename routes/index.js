const express = require('express');
const router = express.Router();
const home = require("./homeRoutes.js");
const user = require("./userRoutes.js");
const api = require("./api");
router.use('/', home);
router.use('/user', user);
router.use('/api', api)

module.exports = router;