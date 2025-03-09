const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const util = require('util');

const execPromise = util.promisify(exec);

/**
 * Check if a PDF is password-protected
 */
async function isPdfPasswordProtected(pdfPath) {
  try {
    await execPromise(`qpdf --check "${pdfPath}"`);
    return false;
  } catch (error) {
    return error.stderr.includes('password');
  }
}

/**
 * Decrypt a password-protected PDF
 */
async function decryptPdf(inputPath, outputPath, password) {
  try {
    await execPromise(`qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`);
    return true;
  } catch (error) {
    if (error.stderr.includes('password')) {
      throw new Error('Incorrect password');
    }
    throw error;
  }
}

/**
 * Convert PDF to images
 */
async function convertPdfToImages(pdfPath, outputDir, density = 300) {
  const outputPattern = path.join(outputDir, 'page-%d.png');
  
  // Use ImageMagick to convert PDF to images
  await execPromise(`convert -density ${density} "${pdfPath}" "${outputPattern}"`);
  
  // Get list of generated image files
  const files = await fs.readdir(outputDir);
  return files.filter(file => file.endsWith('.png')).sort();
}

/**
 * Get base64 string of an image file
 */
async function getImageBase64(imagePath) {
  const data = await fs.readFile(imagePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

/**
 * Main function to process PDF file
 */
exports.processPdfFile = async (pdfPath, outputDir, password, returnBase64 = false) => {
  // Check if PDF is password protected
  const isProtected = await isPdfPasswordProtected(pdfPath);
  
  let pdfToProcess = pdfPath;
  let tempDecryptedPath = null;
  
  // Handle password-protected PDF
  if (isProtected) {
    if (!password) {
      throw new Error('PDF is password protected');
    }
    
    tempDecryptedPath = `${pdfPath}.decrypted.pdf`;
    await decryptPdf(pdfPath, tempDecryptedPath, password);
    pdfToProcess = tempDecryptedPath;
  }
  
  try {
    // Convert PDF to images
    const imageFiles = await convertPdfToImages(pdfToProcess, outputDir);
    
    // Process results based on return type (URL or base64)
    if (returnBase64) {
      // Return base64 encoded images
      const base64Promises = imageFiles.map(file => 
        getImageBase64(path.join(outputDir, file))
      );
      return Promise.all(base64Promises);
    } else {
      // Return image URLs
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const jobId = path.basename(outputDir);
      
      return imageFiles.map(file => 
        `${baseUrl}/storage/processed/${jobId}/${file}`
      );
    }
  } finally {
    // Clean up temporary decrypted file if it was created
    if (tempDecryptedPath && await fs.pathExists(tempDecryptedPath)) {
      await fs.unlink(tempDecryptedPath).catch(() => {});
    }
  }
};
