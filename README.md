# PDF Processing API Service Specification

## Overview
This document outlines the specifications for a JavaScript-based API service that enables users to upload PDF files, process them (including password decryption if needed), and convert them to images.

## Dependencies
- Node.js
- Express.js (for API server)
- QPDF (for PDF decryption)
- ImageMagick (for PDF to image conversion)
- Multer (for file uploads)

## API Endpoints

### 1. PDF Upload and Processing

**Endpoint:** `POST /api/upload`

**Description:** Uploads PDF files, handles decryption if needed, converts to images, and returns access paths.

**Request:**
- Content-Type: `multipart/form-data`
- Form Fields:
    - `file` (required): The PDF file to upload
    - `password` (optional): Password for protected PDFs
    - `base64` (optional): Boolean flag (true/false) to return base64 encoded images instead of URLs

**Response:**
- Status 200:
    ```json
    {
        "success": true,
        "images": [
            "https://example.com/storage/processed/abc123/page-1.png",
            "https://example.com/storage/processed/abc123/page-2.png"
        ],
        "jobId": "abc123"
    }
    ```

- With base64 option:
    ```json
    {
        "success": true,
        "images": [
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
        ],
        "jobId": "abc123"
    }
    ```

**Error Responses:**
- Status 400: Invalid request (missing file, invalid format)
- Status 401: Password required or incorrect password
- Status 500: Processing error

### 2. Image Retrieval

**Endpoint:** `GET /api/images/:jobId/:filename`

**Description:** Download a specific processed image by job ID and filename.

**Response:**
- Status 200: The requested image file
- Status 404: Image not found

## Processing Flow

1. User uploads PDF file through the API endpoint
2. System checks if the PDF is password-protected
     - If protected and password provided, decrypt using QPDF
     - If protected but no password provided, return error
3. Convert decrypted/unprotected PDF to images using ImageMagick
4. Store images in a designated location with a unique job ID
5. Return image paths or base64 strings based on request parameters

## Security Considerations

- Temporary files should be properly cleaned up after processing
- Consider rate limiting to prevent abuse
- Implement maximum file size limitations
- Use secure file naming to prevent path traversal attacks

## Implementation Notes

- PDF decryption will use QPDF command line utility through child_process
- ImageMagick will be used with density settings for high quality image conversion
- Base64 encoding should be done efficiently for large files
- Consider implementing job queuing for large PDFs or high traffic

## Future Enhancements

- Add support for specific image formats (PNG, JPEG, etc.)
- Implement image quality/resolution options
- Add batch processing capabilities
- Provide thumbnail generation option

## Development Information

### Dependency Management
This project uses Dependabot to automatically create pull requests for dependency updates. The configuration is managed in `.github/dependabot.yml` and includes:
- Weekly checks for npm package updates
- Weekly checks for GitHub Actions updates
- Automated version bump pull requests