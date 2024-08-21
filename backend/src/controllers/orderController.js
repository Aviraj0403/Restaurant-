// controllers/orderController.js
import { OrderModel } from '../models/orderModel.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.send(orders);
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch orders' });
  }
};

export const createOrder = async (req, res) => {
  const { userId, items, totalAmount, status } = req.body;
  try {
    const order = new OrderModel({
      userId,
      items,
      totalAmount,
      status,
    });

    await order.save();
    res.send(order);
  } catch (error) {
    console.error(`Error creating order: ${error.message}`);
    res.status(500).send({ error: 'Failed to create order' });
  }
};

export const updateOrder = async (req, res) => {
  const { id, status } = req.body;
  try {
    await OrderModel.updateOne(
      { _id: id },
      { status }
    );
    res.send();
  } catch (error) {
    console.error(`Error updating order: ${error.message}`);
    res.status(500).send({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    await OrderModel.deleteOne({ _id: orderId });
    res.send();
  } catch (error) {
    console.error(`Error deleting order: ${error.message}`);
    res.status(500).send({ error: 'Failed to delete order' });
  }
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findById(orderId);
    res.send(order);
  } catch (error) {
    console.error(`Error fetching order by ID: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch order by ID' });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await OrderModel.find({ userId });
    res.send(orders);
  } catch (error) {
    console.error(`Error fetching orders by user ID: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch orders by user ID' });
  }
};
