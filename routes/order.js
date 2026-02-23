const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/", Controller.orderList);

router.post("/create", Controller.createOrder);

router.get("/:id", Controller.orderDetail);

module.exports = router;
