import express from "express";
import { placeOrder, getUserOrders } from "../controllers/ordercontroller.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/:userId", getUserOrders);

export default router;