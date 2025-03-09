const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import route handlers
const pdfRoutes = require('./routes/pdfRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Static file serving for processed images
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// API routes
app.use('/api', pdfRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
