import { validateImageFile } from '../utils/imageValidation.mjs';
import { validateFileUpload } from '../utils/fileUploadService.mjs';

/**
 * Middleware to validate profile image uploads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateProfileImageUpload = async (req, res, next) => {
  try {
    // Check if it's a multipart/form-data request
    if (!req.is('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Validate file upload
    const validation = validateFileUpload(req);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const file = validation.file;

    // Validate image file
    const imageValidation = await validateImageFile(file);
    if (!imageValidation.valid) {
      return res.status(400).json({ error: imageValidation.error });
    }

    // If validation passes, add file to request for use in controller
    req.validatedFile = file;
    next();

  } catch (error) {
    console.error('File upload validation error:', error);
    res.status(500).json({ error: 'Internal server error during file validation' });
  }
};

/**
 * Middleware to handle JSON data and file upload in multipart requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const handleMultipartData = (req, res, next) => {
  try {
    // Parse JSON data from multipart form
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (parseError) {
        // If it's not JSON, keep it as is
        console.warn('Failed to parse JSON from multipart form:', parseError.message);
      }
    }

    // Check for file and validate if present
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      
      // Basic file validation
      if (!file || file.size === 0) {
        return res.status(400).json({ error: 'No valid file provided' });
      }

      // Add file to request for use in controller
      req.uploadedFile = file;
    }

    next();

  } catch (error) {
    console.error('Multipart data handling error:', error);
    res.status(500).json({ error: 'Internal server error processing multipart data' });
  }
};

/**
 * Error handling middleware for file uploads
 * @param {Object} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const handleFileUploadErrors = (error, req, res, next) => {
  console.error('File upload error:', error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds the maximum allowed size' });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Too many files uploaded' });
  }

  if (error.code === 'LIMIT_FIELD_KEY') {
    return res.status(400).json({ error: 'Field name too long' });
  }

  if (error.code === 'LIMIT_FIELD_VALUE') {
    return res.status(400).json({ error: 'Field value too long' });
  }

  if (error.code === 'LIMIT_FIELD_COUNT') {
    return res.status(400).json({ error: 'Too many fields' });
  }

  if (error.code === 'LIMIT_PART_COUNT') {
    return res.status(400).json({ error: 'Too many parts' });
  }

  // Default error
  res.status(500).json({ error: 'Internal server error during file upload' });
};