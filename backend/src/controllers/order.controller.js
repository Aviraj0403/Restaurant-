import { OrderModel } from '../models/orderModel.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/userModel.js';
import { sendEmailReceipt } from '../helpers/mailHelper.js';

const createOrder = async (req, res) => {
  try {
    const order = req.body;

    if (!order.items || order.items.length <= 0) {
      return res.status(400).json({ message: 'Cart is empty!' });
    }

    // Remove existing new order for the user
    await OrderModel.deleteOne({ user: req.user.id, status: OrderStatus.NEW });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

const payOrder = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const order = await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });

    if (!order) {
      return res.status(400).json({ message: 'Order not found!' });
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.json({ orderId: order._id });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = { _id: orderId };
    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);
    if (!order) {
      return res.status(404).json({ message: 'Order not found!' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ message: 'Error tracking order', error: error.message });
  }
};

const getNewOrderForCurrentUser = async (req, res) => {
  try {
    const order = await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW }).populate('user');
    if (!order) {
      return res.status(404).json({ message: 'No new order found for user' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching new order for user:', error);
    res.status(500).json({ message: 'Error fetching new order for user', error: error.message });
  }
};

const getAllOrderStatuses = (req, res) => {
  res.json(Object.values(OrderStatus));
};

const getOrdersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);

    const filter = {};
    if (!user.isAdmin) filter.user = user._id;
    if (status) filter.status = status;

    const orders = await OrderModel.find(filter).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({ message: 'Error fetching orders by status', error: error.message });
  }
};

export { createOrder, payOrder, trackOrder, getNewOrderForCurrentUser, getAllOrderStatuses, getOrdersByStatus };
