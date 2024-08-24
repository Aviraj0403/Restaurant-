import express from 'express';
import cors from 'cors';
import foodRouter from './src/routers/foodRouter.js';
import userRouter from './src/routers/userRouter.js';
import orderRouter from './src/routers/orderRouter.js';
import uploadRouter from './src/routers/uploadRouter.js';
import cartRouter from './src/routers/cartRouter.js'

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local development URL
      'https://br-tech.vercel.app', // Vercel deployment URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true,
  })
);

// Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/cart', cartRouter);

// Serve the frontend application (if applicable)
// Update this part based on your frontend setup
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
