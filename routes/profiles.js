const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/middleware");

router.get("/", isLoggedIn, Controller.getProfile);

module.exports = router;
