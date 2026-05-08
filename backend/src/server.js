require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Team Task Manager API is running' }));

// MongoDB connection
const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI === 'your_mongodb_connection_string_here') {
    console.log('MongoDB: Please provide a valid MONGO_URI in .env file');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
