const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/:username", Controller.getProfile);
router.get("/:username/edit", Controller.getProfileEdit);
router.post("/:username/edit", Controller.postProfileEdit);

module.exports = router;
