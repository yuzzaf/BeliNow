const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/middleware");

router.get("/:username", isLoggedIn, Controller.getProfile);
router.get("/:username/edit", isLoggedIn, Controller.getProfileEdit);
router.post("/:username/edit", isLoggedIn, Controller.postProfileEdit);

module.exports = router;
