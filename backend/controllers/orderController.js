import Order from "../models/orderModel.js";

// Create new order
// POST /api/orders
// Private

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ error: "No order items" });
  } else {
    try {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((item) => ({
          ...item,
          product: item._id,
          _id: undefined,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Get logged in user orders
// GET /api/orders/myorders
// Private
const getMyOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get order by ID
// GET /api/orders/:id
// Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(400).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update order to paid
// PUT /api/orders/:id/pay
// Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    } else {
      res.status(400).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update order to delivered
// GET /api/orders/:id/deliver
// Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(204).json({ error: "Order Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all orders
// GET /api/orders
// Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(202).json({ error: "No Order Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
