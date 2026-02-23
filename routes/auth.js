const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/login", Controller.getLogin);
router.post("/login", Controller.postLogin);

router.get("/register", Controller.getRegister);
router.post("/register", Controller.postRegister);

router.get("/logout", Controller.logout);

module.exports = router;
