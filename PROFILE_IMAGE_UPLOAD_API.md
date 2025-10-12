# Profile Image Upload API Documentation

This document provides comprehensive information about the profile image upload functionality for the participants API.

## Overview

The profile image upload system provides two main endpoints for managing participant profile images:

1. **Dedicated Upload Endpoint**: `POST /api/participants/:username/profile-image` - For uploading profile images only
2. **Integrated Update Endpoint**: `PUT /api/participants/:username` - For updating participant data including profile images

## Features

- **File Validation**: Strict validation for image files (JPG/PNG only)
- **Size Limits**: Maximum 2MB per image
- **Dimension Requirements**: Minimum 100x100px, maximum 2000x2000px
- **Automatic Replacement**: New images automatically replace existing ones
- **URL Generation**: Automatic profile image URL generation
- **Error Handling**: Comprehensive error handling and validation

## API Endpoints

### 1. Upload Profile Image (Dedicated Endpoint)

**Endpoint**: `POST /api/participants/:username/profile-image`

**Description**: Uploads a profile image for a specific participant

**Authentication**: Bearer token required

**Content-Type**: `multipart/form-data`

**Request Parameters**:
- `:username` (path parameter) - The participant's username
- `profileImage` (form field) - The image file to upload

**Request Example**:
```bash
curl -X POST \
  http://localhost:9999/api/participants/johndoe/profile-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"
```

**Response (Success - 200)**:
```json
{
  "message": "Profile image uploaded successfully",
  "profile_image": {
    "path": "uploads/profiles/johndoe.jpg",
    "url": "http://localhost:9999/uploads/profiles/johndoe.jpg"
  }
}
```

**Response (Error - 400)**:
```json
{
  "error": "Only JPG and PNG files are allowed"
}
```

**Response (Error - 400)**:
```json
{
  "error": "File size exceeds 2MB limit"
}
```

**Response (Error - 400)**:
```json
{
  "error": "Image dimensions must be at least 100x100px"
}
```

### 2. Update Participant with Profile Image (Integrated Endpoint)

**Endpoint**: `PUT /api/participants/:username`

**Description**: Updates participant data and optionally uploads a new profile image

**Authentication**: Bearer token required

**Content-Type**: `multipart/form-data`

**Request Parameters**:
- `:username` (path parameter) - The participant's username
- `profileImage` (optional form field) - The image file to upload
- Other participant fields (JSON string) - e.g., `name`, `email`, `biography`, etc.

**Request Example**:
```bash
curl -X PUT \
  http://localhost:9999/api/participants/johndoe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profileImage=@/path/to/image.jpg" \
  -F '{"name": "John Doe", "email": "john@example.com", "biography": "Updated bio"}'
```

**Response (Success - 200)**:
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "biography": "Updated bio",
  "phone": null,
  "current_location": null,
  "field_of_study_work_research": null,
  "institution": null,
  "linkedIn": null,
  "instagram": null,
  "facebook": null,
  "website": null,
  "interests": null,
  "expertise": null,
  "profile_image": "uploads/profiles/johndoe.jpg",
  "profile_image_url": "http://localhost:9999/uploads/profiles/johndoe.jpg"
}
```

### 3. Get Participant with Profile Image

**Endpoint**: `GET /api/participants/:username`

**Description**: Retrieves participant data including profile image URL if available

**Authentication**: Bearer token required

**Response (Success - 200)**:
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "biography": "Sample bio",
  "phone": "+1234567890",
  "current_location": "New York",
  "field_of_study_work_research": "Computer Science",
  "institution": "University",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "instagram": "@johndoe",
  "facebook": "johndoe",
  "website": "https://johndoe.com",
  "interests": ["technology", "music"],
  "expertise": ["JavaScript", "Node.js"],
  "profile_image": "uploads/profiles/johndoe.jpg",
  "profile_image_url": "http://localhost:9999/uploads/profiles/johndoe.jpg"
}
```

## File Upload Requirements

### Supported File Types
- **JPEG/JPG**: `.jpg`, `.jpeg`
- **PNG**: `.png`

### File Size Limits
- **Maximum**: 2MB (2,048,000 bytes)
- **Minimum**: 1KB (practical minimum)

### Image Dimensions
- **Minimum**: 100x100 pixels
- **Maximum**: 2000x2000 pixels
- **Aspect Ratio**: Any aspect ratio is accepted

### File Naming Convention
- Profile images are stored as: `{username}.{extension}`
- Example: `johndoe.jpg`, `janedoe.png`
- Username is sanitized to remove special characters

## Frontend Integration Guide

### 1. Setting up the Upload Component

```javascript
import React, { useState } from 'react';

const ProfileImageUpload = ({ username, token }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`/api/participants/${username}/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Update the UI with the new image URL
        console.log('Profile image URL:', data.profile_image.url);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Image uploaded successfully!</p>}
    </div>
  );
};
```

### 2. Updating Participant with Image

```javascript
const updateParticipantWithImage = async (username, token, formData) => {
  const updateData = new FormData();
  
  // Add image file if provided
  if (formData.image) {
    updateData.append('profileImage', formData.image);
  }
  
  // Add other participant data as JSON string
  const participantData = {
    name: formData.name,
    email: formData.email,
    biography: formData.biography
  };
  updateData.append('participantData', JSON.stringify(participantData));

  try {
    const response = await fetch(`/api/participants/${username}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: updateData
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Participant updated:', data);
      return data;
    } else {
      console.error('Update failed:', data.error);
      throw new Error(data.error);
    }
  } catch (err) {
    console.error('Update error:', err);
    throw err;
  }
};
```

### 3. Displaying Profile Images

```javascript
const ParticipantProfile = ({ participant }) => {
  return (
    <div>
      <img
        src={participant.profile_image ? `/uploads/profiles/${participant.profile_image.split('/').pop()}` : '/default-avatar.png'}
        alt="Profile"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
      <h2>{participant.name}</h2>
      <p>{participant.email}</p>
    </div>
  );
};
```

## Error Handling

### Common Error Scenarios

1. **Invalid File Type**
   ```json
   { "error": "Only JPG and PNG files are allowed" }
   ```

2. **File Too Large**
   ```json
   { "error": "File size exceeds 2MB limit" }
   ```

3. **Image Too Small**
   ```json
   { "error": "Image dimensions must be at least 100x100px" }
   ```

4. **Authentication Failed**
   ```json
   { "error": "Unauthorized" }
   ```

5. **User Not Found**
   ```json
   { "error": "Participant not found" }
   ```

### Frontend Error Handling

```javascript
const handleUploadError = (error) => {
  if (error.includes('file type')) {
    alert('Please upload a JPG or PNG image file.');
  } else if (error.includes('file size')) {
    alert('File size must be less than 2MB.');
  } else if (error.includes('dimensions')) {
    alert('Image must be at least 100x100 pixels.');
  } else {
    alert('Upload failed. Please try again.');
  }
};
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **File Validation**: Server-side validation prevents malicious file uploads
3. **Path Sanitization**: Usernames are sanitized to prevent directory traversal
4. **File Size Limits**: Prevents denial-of-service attacks
5. **Content-Type Validation**: Ensures only image files are accepted

## Testing

### Manual Testing with curl

```bash
# Test successful upload
curl -X POST \
  http://localhost:9999/api/participants/testuser/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@test.jpg"

# Test invalid file type
curl -X POST \
  http://localhost:9999/api/participants/testuser/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@test.txt"

# Test file size limit
curl -X POST \
  http://localhost:9999/api/participants/testuser/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@large_file.jpg"
```

### Frontend Testing Checklist

- [ ] Upload valid JPG image
- [ ] Upload valid PNG image
- [ ] Upload invalid file type (PDF, TXT, etc.)
- [ ] Upload oversized file (>2MB)
- [ ] Upload undersized image (<100x100px)
- [ ] Test with authentication token
- [ ] Test without authentication token
- [ ] Test with non-existent username
- [ ] Test image replacement functionality
- [ ] Verify image URL in response
- [ ] Test update endpoint with both data and image

### Accessing Uploaded Images

Uploaded profile images are served as static files through the `/uploads` endpoint. To access a participant's profile image:

**URL Pattern**: `http://localhost:9999/uploads/profiles/{filename}`

**Example**: `http://localhost:9999/uploads/profiles/johndoe.jpg`

**Frontend Implementation**:
```javascript
const getProfileImageUrl = (participant) => {
  if (participant.profile_image) {
    // Extract just the filename from the full path
    const filename = participant.profile_image.split('/').pop();
    return `/uploads/profiles/${filename}`;
  }
  return '/default-avatar.png';
};

// Usage in component
<img src={getProfileImageUrl(participant)} alt="Profile" />
```

### Frontend Testing Checklist

- [ ] Upload valid JPG image
- [ ] Upload valid PNG image
- [ ] Upload invalid file type (PDF, TXT, etc.)
- [ ] Upload oversized file (>2MB)
- [ ] Upload undersized image (<100x100px)
- [ ] Test with authentication token
- [ ] Test without authentication token
- [ ] Test with non-existent username
- [ ] Test image replacement functionality
- [ ] Verify image path in response
- [ ] Test accessing uploaded images via /uploads endpoint
- [ ] Test update endpoint with both data and image