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

### Code Quality and Consistency

#### Linting
This project uses GitHub Super-Linter for comprehensive linting across multiple languages and formats. Super-Linter helps maintain code quality by:
- Enforcing consistent code style
- Detecting syntax errors
- Identifying potential bugs and security issues
- Supporting JavaScript, JSON, YAML, Markdown, and more

#### Commit Messages
We enforce conventional commit messages using commitlint in our CI workflow. This ensures:
- Consistent commit message format
- Easier generation of changelogs
- Better readability and project history
- Automated semantic versioning

The commit message format follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
type(scope): subject
```

Common types include:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

## Project Status: Experimental

⚠️ **IMPORTANT NOTICE** ⚠️

This project is currently in an **experimental stage** and is being developed for research and educational purposes only. It is not ready for production use and comes with several important caveats:

- The code may contain bugs, security vulnerabilities, or performance issues
- APIs and functionality are subject to change without notice
- No guarantees are made regarding uptime, reliability, or data integrity
- Limited testing has been performed across different environments and use cases
- Support is limited and provided on a best-effort basis

**DO NOT** use this project in:
- Production environments
- Systems handling sensitive data
- Applications requiring high reliability or uptime
- Critical infrastructure or business processes

By using this software, you acknowledge that you understand its experimental nature and accept all associated risks.

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.

### Apache License 2.0 Summary

- You can freely use, modify, distribute and sell this software.
- You must include the license and copyright notice with each distribution.
- You must state changes made to the code.
- You cannot use the copyright holders' names to promote products derived from this software without specific permission.
- This software is provided without warranties or conditions of any kind.

For the full license text, refer to the [LICENSE](LICENSE) file or visit [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).