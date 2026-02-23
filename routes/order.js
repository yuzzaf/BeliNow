const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.orderList);

router.get("/:id", Controller.orderDetail);

router.post("/create", Controller.createOrder);

module.exports = router;
