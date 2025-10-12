import fs from 'fs/promises';
import path from 'path';
import { getProfileImagePath, generateProfileImageFilename } from './imageValidation.mjs';

/**
 * Saves a profile image to the server
 * @param {string} username - Participant username
 * @param {Object} file - Express file object
 * @returns {Promise<{success: boolean, filePath?: string, error?: string}>}
 */
export const saveProfileImage = async (username, file) => {
  try {
    if (!file || !file.data) {
      return { success: false, error: 'No file data provided' };
    }

    // Generate filename and create full path
    const originalExtension = path.extname(file.name);
    const filename = generateProfileImageFilename(username, originalExtension);
    const filePath = getProfileImagePath(filename);
    const fullPath = path.join(process.cwd(), filePath);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Save the file
    await fs.writeFile(fullPath, file.data);

    return { success: true, filePath };

  } catch (error) {
    console.error('Error saving profile image:', error);
    return { success: false, error: 'Failed to save image file' };
  }
};

/**
 * Deletes a profile image from the server
 * @param {string} filePath - Relative file path to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProfileImage = async (filePath) => {
  try {
    if (!filePath) {
      return { success: false, error: 'No file path provided' };
    }

    const fullPath = path.join(process.cwd(), filePath);

    // Check if file exists before deleting
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      return { success: true };
    } catch (accessError) {
      // File doesn't exist, consider it a success
      return { success: true };
    }

  } catch (error) {
    console.error('Error deleting profile image:', error);
    return { success: false, error: 'Failed to delete image file' };
  }
};

/**
 * Gets the full URL for a profile image
 * @param {string} filePath - Relative file path
 * @param {string} baseUrl - Base URL for the server
 * @returns {string} Full image URL
 */
export const getProfileImageUrl = (filePath, baseUrl = 'http://localhost:9999') => {
  if (!filePath) {
    return null;
  }
  return `${baseUrl}/${filePath}`;
};

/**
 * Validates file upload request
 * @param {Object} req - Express request object
 * @returns {Object} Validation result
 */
export const validateFileUpload = (req) => {
  if (!req.files || !req.files.profileImage) {
    return { valid: false, error: 'No profile image provided' };
  }

  const file = req.files.profileImage;
  if (file.size === 0) {
    return { valid: false, error: 'Empty file provided' };
  }

  return { valid: true, file };
};