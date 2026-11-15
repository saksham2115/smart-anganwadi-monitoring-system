const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const childrenRoutes = require('./routes/children');
const attendanceRoutes = require('./routes/attendance');
const mealsRoutes = require('./routes/meals');
const growthRoutes = require('./routes/growth');
const activitiesRoutes = require('./routes/activities');
const centersRoutes = require('./routes/centers');
const supervisorRoutes = require('./routes/supervisor');
const alertsRoutes = require('./routes/alerts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with graceful fallback
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI && !MONGODB_URI.includes('YOUR_MONGODB_URI')) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
      console.warn('⚠️ MongoDB connection failed. Running with resilient local file/memory store:', err.message);
    });
} else {
  console.log('ℹ️ Running in resilient Zero-Config Mode with auto-seeded JSON datastore.');
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Smart Anganwadi Monitoring System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/centers', centersRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/alerts', alertsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Smart Anganwadi Backend running on port ${PORT}`);
});
