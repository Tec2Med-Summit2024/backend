import sharp from 'sharp';

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// File size limits (2MB = 2 * 1024 * 1024 bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Image dimension limits
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 2000;

/**
 * Validates if a file is a valid image
 * @param {Object} file - Express file object
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export const validateImageFile = async (file) => {
  try {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 2MB limit' };
    }

    // Check file extension
    const fileExtension = file.name ? `.${file.name.split('.').pop().toLowerCase()}` : '';
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return { valid: false, error: 'Only JPG and PNG files are allowed' };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return { valid: false, error: 'Invalid file type' };
    }

    // Validate image dimensions using Sharp
    const metadata = await sharp(file.data).metadata();
    
    if (!metadata.width || !metadata.height) {
      return { valid: false, error: 'Invalid image file' };
    }

    // Check minimum dimensions
    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
      return { valid: false, error: `Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px` };
    }

    // Check maximum dimensions
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      return { valid: false, error: `Image dimensions must not exceed ${MAX_DIMENSION}x${MAX_DIMENSION}px` };
    }

    return { valid: true };

  } catch (error) {
    console.error('Image validation error:', error);
    return { valid: false, error: 'Invalid image file' };
  }
};

/**
 * Generates a unique filename for profile images
 * @param {string} username - Participant username
 * @param {string} originalExtension - Original file extension
 * @returns {string} Generated filename
 */
export const generateProfileImageFilename = (username, originalExtension) => {
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9.-]/g, '_');
  const extension = originalExtension.toLowerCase() === '.jpeg' ? '.jpg' : originalExtension.toLowerCase();
  return `${sanitizedUsername}${extension}`;
};

/**
 * Gets the file path for a profile image
 * @param {string} filename - Image filename
 * @returns {string} Relative file path
 */
export const getProfileImagePath = (filename) => {
  return `uploads/profiles/${filename}`;
};

/**
 * Checks if a file is an image (basic check)
 * @param {string} filename - Filename to check
 * @param {string} mimetype - MIME type to check
 * @returns {boolean}
 */
export const isImageFile = (filename, mimetype) => {
  const fileExtension = filename ? `.${filename.split('.').pop().toLowerCase()}` : '';
  return ALLOWED_EXTENSIONS.includes(fileExtension) && ALLOWED_MIME_TYPES.includes(mimetype);
};