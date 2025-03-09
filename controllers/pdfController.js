const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { processPdfFile } = require('../utils/pdfProcessor');

// Process uploaded PDF
exports.processPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const password = req.body.password || null;
    const returnBase64 = req.body.base64 === 'true';
    const jobId = uuidv4();
    const uploadPath = req.file.path;
    const outputDir = path.join(__dirname, `../storage/processed/${jobId}`);
    
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    try {
      // Process the PDF file
      const images = await processPdfFile(uploadPath, outputDir, password, returnBase64);
      
      // Return image paths or base64 strings
      res.status(200).json({
        success: true,
        images,
        jobId
      });
    } catch (error) {
      if (error.message === 'PDF is password protected') {
        return res.status(401).json({ success: false, message: 'PDF is password protected. Please provide a password.' });
      }
      if (error.message === 'Incorrect password') {
        return res.status(401).json({ success: false, message: 'Incorrect password provided.' });
      }
      throw error;
    } finally {
      // Clean up the uploaded file
      await fs.unlink(uploadPath).catch(() => {});
    }
  } catch (error) {
    next(error);
  }
};

// Get specific processed image
exports.getImage = async (req, res, next) => {
  try {
    const { jobId, filename } = req.params;
    const imagePath = path.join(__dirname, `../storage/processed/${jobId}/${filename}`);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    res.sendFile(imagePath);
  } catch (error) {
    next(error);
  }
};
