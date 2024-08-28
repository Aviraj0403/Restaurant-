import { Router } from 'express';
import { createOrder, payOrder, trackOrder, getNewOrderForCurrentUser, getAllOrderStatuses, getOrdersByStatus } from '../controllers/order.controller.js';
import auth from '../middleware/authMid.js';

const router = Router();

router.use(auth);

router.post('/create', createOrder);
router.put('/pay', payOrder);
router.get('/track/:orderId', trackOrder);
router.get('/newOrderForCurrentUser', getNewOrderForCurrentUser);
router.get('/allstatus', getAllOrderStatuses);
router.get('/:status?', getOrdersByStatus);

export default router;
