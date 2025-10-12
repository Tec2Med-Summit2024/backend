// TODO: Add documentation

import {
  getParticipantFromDb,
  updateParticipantInDb,
  addEventToParticipantSchedule,
  removeEventFromParticipantSchedule,
  addParticipantCertificate,
  getParticipantCertificate,
  getParticipantCertificates,
  getParticipantQuestions,
  getParticipantFollowedPartners,
  updateParticipantProfileImageInDb,
} from './participants.service.mjs';

import { validateImageFile } from '../../utils/imageValidation.mjs';
import { saveProfileImage, deleteProfileImage, getProfileImageUrl, validateFileUpload } from '../../utils/fileUploadService.mjs';

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getParticipant = async (req, res) => {
  try {
    const result = await getParticipantFromDb(req.username);
    if (result.ok) {
      // Filter out sensitive fields that should not be returned
      const filteredParticipant = filterSensitiveFields(result.value);
      return res.status(200).json(filteredParticipant);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 * Filters out sensitive fields from participant data
 * @param {Object} participant - The participant object
 * @returns {Object} - Filtered participant object
 */
const filterSensitiveFields = (participant) => {
  if (!participant) return null;
  
  // List of sensitive fields that should not be returned
  const sensitiveFields = [
    'password',
    'verification_code',
    'phone_number',
    'organization',
    'professionalField',
    'cityCountry',
    'country_code'
  ];
  
  // Create a new object with only non-sensitive fields
  const filtered = {};
  for (const key in participant) {
    if (!sensitiveFields.includes(key)) {
      filtered[key] = participant[key];
    }
  }
  
  return filtered;
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateParticipant = async (req, res) => {
  try {
    const updateData = { ...req.body };
    let profileImagePath = null;

    // Check if profile image is being uploaded
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      
      // Validate image file
      const imageValidation = await validateImageFile(file);
      if (!imageValidation.valid) {
        return res.status(400).json({ error: imageValidation.error });
      }

      // Get current profile image to delete if exists
      const currentImageResult = await updateParticipantProfileImageInDb(req.username, null);
      let currentImagePath = null;
      if (currentImageResult.ok && currentImageResult.value.profile_image) {
        currentImagePath = currentImageResult.value.profile_image;
      }

      // Save new profile image
      const saveResult = await saveProfileImage(req.username, file);
      if (!saveResult.success) {
        return res.status(500).json({ error: saveResult.error });
      }

      profileImagePath = saveResult.filePath;

      // Delete old image if it exists
      if (currentImagePath) {
        await deleteProfileImage(currentImagePath);
      }
    }

    // Update participant data
    const result = await updateParticipantInDb(req.username, updateData);
    if (result.ok) {
      // Update profile image if uploaded
      if (profileImagePath) {
        const imageUpdateResult = await updateParticipantProfileImageInDb(req.username, profileImagePath);
        if (!imageUpdateResult.ok) {
          // If image update fails, delete the saved file
          await deleteProfileImage(profileImagePath);
          return res.status(imageUpdateResult.error).json({ error: imageUpdateResult.errorMsg });
        }
      }
      return res.status(200).json(result.value);
    }
    
    // If participant update fails, delete uploaded image if any
    if (profileImagePath) {
      await deleteProfileImage(profileImagePath);
    }
    
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const addEventToSchedule = async (req, res) => {
  try {
    const result = await addEventToParticipantSchedule(
      req.username,
      req.body.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const removeEventFromSchedule = async (req, res) => {
  try {
    const result = await removeEventFromParticipantSchedule(
      req.username,
      req.params.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const addCertificate = async (req, res) => {
  try {
    console.log(req.body);
    const result = await addParticipantCertificate(
      req.username,
      req.body.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getCertificate = async (req, res) => {
  try {
    const result = await getParticipantCertificate(
      req.username,
      req.params.certificateID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getCertificates = async (req, res) => {
  try {
    const result = await getParticipantCertificates(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getQuestions = async (req, res) => {
  try {
    const result = await getParticipantQuestions(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getFollowedPartners = async (req, res) => {
  try {
    const result = await getParticipantFollowedPartners(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 * Upload profile image for a participant
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const uploadProfileImage = async (req, res) => {
  try {
    // Validate file upload
    const validation = validateFileUpload(req);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const file = validation.file;
    const username = req.username;

    // Validate image file
    const imageValidation = await validateImageFile(file);
    if (!imageValidation.valid) {
      return res.status(400).json({ error: imageValidation.error });
    }

    // Get current profile image to delete if exists
    const currentImageResult = await updateParticipantProfileImageInDb(username, null);
    let currentImagePath = null;
    if (currentImageResult.ok && currentImageResult.value.profile_image) {
      currentImagePath = currentImageResult.value.profile_image;
    }

    // Save new profile image
    const saveResult = await saveProfileImage(username, file);
    if (!saveResult.success) {
      return res.status(500).json({ error: saveResult.error });
    }

    // Update database with new image path
    const updateResult = await updateParticipantProfileImageInDb(username, saveResult.filePath);
    if (!updateResult.ok) {
      // If database update fails, delete the saved file
      await deleteProfileImage(saveResult.filePath);
      return res.status(updateResult.error).json({ error: updateResult.errorMsg });
    }

    // Delete old image if it exists
    if (currentImagePath) {
      await deleteProfileImage(currentImagePath);
    }

    // Return success response with image URL
    const imageUrl = getProfileImageUrl(saveResult.filePath);
    return res.status(200).json({
      message: 'Profile image uploaded successfully',
      profile_image: {
        path: saveResult.filePath,
        url: imageUrl
      }
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).send(error.message);
  }
};
