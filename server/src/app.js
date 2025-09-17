const express = require('express');
const cors = require('cors');
const multer = require('multer');
const routes = require('./routes');
const { autoExpireMembers } = require('./services/memberService');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Set up periodic auto-expire (every hour)
setInterval(async () => {
  console.log('Running periodic auto-expire check...');
  await autoExpireMembers();
}, 60 * 60 * 1000);

module.exports = app;