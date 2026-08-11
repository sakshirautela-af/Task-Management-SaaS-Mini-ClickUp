import 'dotenv/config';
import express from 'express';
import corsMiddleware from './config/cors.js';
import userRoutes from './routes/users.routes.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;