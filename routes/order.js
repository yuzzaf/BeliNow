const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/", Controller.orderList);
router.get("/history", Controller.orderHistory);
router.post("/create/:productId", Controller.createOrder);
router.get("/checkout/success", Controller.checkoutSuccess);
router.get("/checkout/cancel", Controller.checkoutCancel);
router.post("/:id/checkout", Controller.checkoutOrder);
router.post("/:id/delete", Controller.deleteOrder);
router.post("/item/:orderDetailId/increase", Controller.increaseQty);
router.post("/item/:orderDetailId/decrease", Controller.decreaseQty);
router.post("/item/:orderDetailId/delete", Controller.deleteCartItem);
router.get("/:id", Controller.orderDetail);

module.exports = router;
