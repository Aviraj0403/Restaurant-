import { BAD_REQUEST, UNAUTHORIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../models/orderModel.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/userModel.js';
import { sendEmailReceipt } from '../helpers/mailHelper.js';

export const createOrder = async (req, res) => {
  const order = req.body;

  if (order.items.length <= 0) {
    return res.status(BAD_REQUEST).send('Cart Is Empty!');
  }

  await OrderModel.deleteOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  });

  const newOrder = new OrderModel({ ...order, user: req.user.id });
  await newOrder.save();
  res.send(newOrder);
};

export const payForOrder = async (req, res) => {
  const { paymentId } = req.body;
  const order = await getNewOrderForCurrentUser(req);
  if (!order) {
    return res.status(BAD_REQUEST).send('Order Not Found!');
  }

  order.paymentId = paymentId;
  order.status = OrderStatus.PAYED;
  await order.save();

  sendEmailReceipt(order);

  res.send(order._id);
};

export const trackOrder = async (req, res) => {
  const { orderId } = req.params;
  const user = await UserModel.findById(req.user.id);

  const filter = {
    _id: orderId,
  };

  if (!user.isAdmin) {
    filter.user = user._id;
  }

  const order = await OrderModel.findOne(filter);

  if (!order) return res.status(UNAUTHORIZED).send('Order not found');

  return res.send(order);
};

export const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');

export const getAllOrderStatus = (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
};

export const getOrders = async (req, res) => {
  const status = req.params.status;
  const user = await UserModel.findById(req.user.id);
  const filter = {};

  if (!user.isAdmin) filter.user = user._id;
  if (status) filter.status = status;

  const orders = await OrderModel.find(filter).sort('-createdAt');
  res.send(orders);
};
