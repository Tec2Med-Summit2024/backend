# Authentication System Documentation

## Overview
This application now has comprehensive JWT-based authentication protecting all API endpoints. All endpoints require valid JWT tokens for access.

## Setup Requirements

### Environment Variables
Ensure your `.env` file contains:
```
TOKEN_SECRET=your-jwt-secret-key-here
```

### Dependencies
Ensure `jsonwebtoken` is installed:
```bash
npm install jsonwebtoken
```

## Authentication Flow

1. **Token Extraction**: The [`authenticateToken`](server/middleware/verifier.mjs:1) middleware extracts the JWT from the `Authorization` header
2. **Token Validation**: The token is verified against the `TOKEN_SECRET` environment variable
3. **User Information Extraction**: User information is extracted from the token (supports multiple token formats) and added to the request object
4. **Access Control**: The [`verifyUsername`](server/middleware/verifier.mjs:25) middleware ensures users can only access their own resources

## Protected Endpoints

All API routes are now protected by the global authentication middleware applied in [`server/app.mjs`](server/app.mjs:31):

- `/api/participants/*` - Participant management endpoints
- `/api/events/*` - Event management endpoints  
- `/api/partners/*` - Partner management endpoints
- `/api/users/*` - User management endpoints

## Authentication Middleware Details

### [`authenticateToken`](server/middleware/verifier.mjs:1)
- **Location**: [`server/middleware/verifier.mjs`](server/middleware/verifier.mjs:1)
- **Function**: Validates JWT tokens and extracts user information (supports multiple token formats)
- **Supported Token Formats**:
  - Login tokens: `{ id, email, role, name, phone }`
  - Verification tokens: `{ email, role }`
- **Error Responses**:
  - `401 Unauthorized` - Missing or invalid token
  - `403 Forbidden` - Expired token

### [`verifyUsername`](server/middleware/verifier.mjs:25)
- **Location**: [`server/middleware/verifier.mjs`](server/middleware/verifier.mjs:25)
- **Function**: Prevents users from accessing other users' resources
- **Error Response**: `403 Forbidden` - Username mismatch

## Request Object Enhancements

After successful authentication, the request object contains:
```javascript
req.user = {
  id: 'user-id-from-jwt',          // From id or username field
  username: 'username-from-jwt',    // From username or id field
  role: 'user-role-from-jwt',
  email: 'user-email-from-jwt',     // If available in token
  name: 'user-name-from-jwt',       // If available in token
  phone: 'user-phone-from-jwt'      // If available in token
}
```

## Usage Examples

### Making Authenticated Requests
```javascript
// Include JWT in Authorization header
fetch('/api/users/profile', {
  headers: {
    'Authorization': 'Bearer your-jwt-token-here'
  }
});
```

### Accessing User Information in Controllers
```javascript
export const getUserProfile = (req, res) => {
  // Access authenticated user information
  const userId = req.user.id;
  const username = req.user.username;
  const role = req.user.role;
  
  // Your controller logic here
};
```

## Error Handling

The authentication system provides clear error responses:

- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Token expired or username mismatch
- **404 Not Found**: Standard route not found response

## Security Considerations

1. **Token Security**: JWT tokens should be stored securely (HTTP-only cookies recommended)
2. **Secret Rotation**: Regularly rotate the `TOKEN_SECRET` environment variable
3. **Token Expiration**: Implement token expiration for enhanced security
4. **Role-Based Access**: Consider adding role-based authorization for sensitive endpoints

## Testing Authentication

To test the authentication system:
1. Obtain a valid JWT token from the auth endpoints
2. Include it in the `Authorization: Bearer <token>` header
3. Verify endpoints return proper responses for both valid and invalid tokens