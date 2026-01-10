# Following API Documentation

This document describes the following functionality endpoints that have been integrated into the Tec2Med application.

## Overview

The following functionality allows users to:
- Follow other users (Partners, Speakers, Instructors, Attendees)
- Unfollow users they are currently following
- View a list of users they are following
- Check if they are following a specific user

## Data Model

The following functionality uses the Neo4j graph database with the following relationship:

```
(:Attendee)-[:FOLLOWS]->(:Partner|:Speaker|:Instructor|:Attendee)
```

## API Endpoints

### 1. Follow a User

**Endpoint:** `POST /api/users/follow/:targetUsername`

**Description:** Creates a FOLLOWS relationship between the authenticated user and the target user.

**Authentication:** Required (JWT token)

**Parameters:**
- `targetUsername` (path parameter): Username of the user to follow

**Request Body:** None

**Response:**
```json
{
  "ok": true,
  "message": "User followed successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Attempting to follow oneself
- `404`: Not Found - Target user not found
- `500`: Internal Server Error - Database error

### 2. Unfollow a User

**Endpoint:** `DELETE /api/users/follow/:targetUsername`

**Description:** Removes the FOLLOWS relationship between the authenticated user and the target user.

**Authentication:** Required (JWT token)

**Parameters:**
- `targetUsername` (path parameter): Username of the user to unfollow

**Request Body:** None

**Response:**
```json
{
  "ok": true,
  "message": "User unfollowed successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Attempting to unfollow oneself
- `404`: Not Found - Target user not found or no following relationship exists
- `500`: Internal Server Error - Database error

### 3. Get Following List

**Endpoint:** `GET /api/users/following`

**Description:** Retrieves a list of users that the authenticated user is following.

**Authentication:** Required (JWT token)

**Parameters:** None

**Response:**
```json
{
  "ok": true,
  "value": [
    {
      "username": "partner1",
      "name": "Partner One",
      "biography": "Partner description",
      "profile_image": "uploads/profiles/partner1.jpg",
      "type": "Partner"
    },
    {
      "username": "speaker1", 
      "name": "Speaker One",
      "biography": "Speaker description",
      "profile_image": "uploads/profiles/speaker1.jpg",
      "type": "Speaker"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing token
- `500`: Internal Server Error - Database error

### 4. Check Following Status

**Endpoint:** `GET /api/users/following/:targetUsername`

**Description:** Checks if the authenticated user is following a specific user.

**Authentication:** Required (JWT token)

**Parameters:**
- `targetUsername` (path parameter): Username of the user to check

**Response:**
```json
{
  "ok": true,
  "value": {
    "isFollowing": true,
    "targetUsername": "partner1"
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing token
- `404`: Not Found - Target user not found
- `500`: Internal Server Error - Database error

## Search Integration

The user search functionality has been enhanced to include following status:

**Endpoint:** `GET /api/users?type={userType}`

**Enhanced Response:**
```json
{
  "ok": true,
  "value": [
    {
      "username": "partner1",
      "name": "Partner One",
      "biography": "Partner description",
      "profile_image": "uploads/profiles/partner1.jpg",
      "follow_exists": true  // Indicates if current user follows this user
    }
  ]
}
```

## Frontend Integration

### API Service Functions

The following service functions are available in `tec2medApp/app/api/services/followingService.js`:

```javascript
// Follow a user
export const followUser = async (targetUsername) => {
  // Implementation
};

// Unfollow a user  
export const unfollowUser = async (targetUsername) => {
  // Implementation
};

// Get following list
export const getFollowing = async () => {
  // Implementation
};

// Check following status
export const checkFollowing = async (targetUsername) => {
  // Implementation
};
```

### Component Integration

#### Following Screen (`tec2medApp/app/screens/sideBar/Following.js`)
- Displays list of followed users
- Uses `getFollowing()` API call
- Shows user cards with follow status

#### Follow Button (`tec2medApp/app/components/buttons/rectangular/small/follow.js`)
- Toggle follow/unfollow functionality
- Updates UI state immediately
- Calls appropriate API functions

#### Search Results (`tec2medApp/app/screens/navBar/search/Search.js`)
- Shows follow status in search results
- Allows follow/unfollow from search results
- Updates follow status in real-time

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400/401/403/404/500
}
```

Common error scenarios:
- **Authentication errors**: Invalid or expired tokens
- **Permission errors**: Users cannot follow themselves
- **Not found errors**: Target user doesn't exist
- **Database errors**: Neo4j query failures

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only modify their own following relationships
3. **Input validation**: Username parameters are validated
4. **Rate limiting**: Consider implementing rate limiting for follow/unfollow operations

## Testing

The following functionality can be tested using:

1. **Manual testing** through the frontend application
2. **API testing** using curl or Postman
3. **Automated testing** with the provided test script

Example curl commands:
```bash
# Get following list (requires authentication)
curl -X GET "http://localhost:9999/api/users/following" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Follow a user
curl -X POST "http://localhost:9999/api/users/follow/partner1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check following status
curl -X GET "http://localhost:9999/api/users/following/partner1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

The following functionality uses the existing Neo4j nodes and relationships:

- **Nodes**: `Attendee`, `Partner`, `Speaker`, `Instructor`
- **Relationship**: `FOLLOWS` (directed relationship from follower to followed)

## Future Enhancements

1. **Follow notifications**: Notify users when someone follows them
2. **Follow suggestions**: Recommend users to follow based on interests
3. **Follow analytics**: Track follow/unfollow trends
4. **Bulk operations**: Follow/unfollow multiple users at once
5. **Privacy settings**: Allow users to control who can follow them

## Troubleshooting

Common issues and solutions:

1. **"User not authenticated" error**: 
   - Check if JWT token is valid and not expired
   - Verify token is properly included in Authorization header

2. **"Access forbidden" error**:
   - Users cannot follow themselves
   - Verify user permissions

3. **"User not found" error**:
   - Check if target username exists
   - Verify correct username format

4. **Database connection errors**:
   - Check Neo4j database connection
   - Verify database service is running
