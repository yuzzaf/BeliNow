const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/", Controller.getLogin);
router.post("/", Controller.postLogin);

router.get("/register", Controller.getRegister);
router.post("/register", Controller.postRegister);

router.get("/logout", Controller.logout);

module.exports = router;
