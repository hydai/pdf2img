const path = require('path');

module.exports = {
  // Storage paths
  paths: {
    uploads: path.join(__dirname, '../uploads'),
    processed: path.join(__dirname, '../storage/processed'),
  },
  
  // File size limits (in bytes)
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  },
  
  // Image conversion settings
  imageSettings: {
    density: 300, // DPI for image conversion
    format: 'png',
  },
  
  // Temporary file cleanup timing (in ms)
  cleanupInterval: 3600000, // 1 hour
};
