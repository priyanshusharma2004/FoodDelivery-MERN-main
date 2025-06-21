import Order from "../models/Orders.js";

export const placeOrder = async (req, res) => {
  try {
    const { total_amount, address, user } = req.body;
    const order = new Order({
      total_amount,
      address,
      user,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order placement failed", error: err });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};