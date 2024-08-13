import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/foodRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import { dbconnect } from './config/databaseConfig.js';
import path, { dirname } from 'path';
import MongoStore from 'connect-mongo';

dbconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local development URL
      'https://br-tech-q2dp5hz76-avi-rajs-projects.vercel.app', // Vercel deployment URL
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

// // Static file serving
// const publicFolder = path.join(__dirname, 'public');
// app.use(express.static(publicFolder));

// Serve the frontend application
app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  res.sendFile(indexFilePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
