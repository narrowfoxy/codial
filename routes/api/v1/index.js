const express = require("express");
const router = express.Router();
const passport = require("passport");
const deletePostController = require("../../../controller/api/v1/deletePostController");
const createSessionController = require("../../../controller/api/v1/createSessionController");

router.get(
  "/destroy-post/:id",
  passport.authenticate("jwt", { session: false }),
  deletePostController
);

router.post("/create/session", createSessionController)

module.exports = router;
