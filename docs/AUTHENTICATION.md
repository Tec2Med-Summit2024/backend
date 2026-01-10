# Authentication System Documentation

## Overview
This application now has comprehensive JWT-based authentication protecting all API endpoints. All endpoints require valid JWT tokens for access.

## Setup Requirements

### Environment Variables
Ensure your `.env` file contains:
```
TOKEN_SECRET=your-jwt-secret-key-here
MAILER_USER=your-email@gmail.com
MAILER_PWD=your-app-password
```

### Mailer Service Configuration
The authentication system includes an email verification service with dual notification:
- **Primary**: Email delivery via Gmail SMTP
- **Backup**: Console logging if email fails

**Required Mailer Settings**:
- `MAILER_USER`: Gmail account for sending verification emails
- `MAILER_PWD`: Gmail app password (not regular password)

**Gmail Setup**:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the app password in `MAILER_PWD`

### Dependencies
Ensure `jsonwebtoken` is installed:
```bash
npm install jsonwebtoken
```

## Authentication Flow

### Email Verification Process
1. **Request Verification Code**: User submits email to `/auth/request-verification`
2. **Generate & Store Code**: System generates 5-digit code and stores it in Neo4j database
3. **Send Email**: System attempts to send verification email via Gmail SMTP
4. **Console Backup**: If email fails, code is logged to console as backup
5. **Verify Code**: User submits code to `/auth/verify` for account verification

### Authentication Steps
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

## Email Verification Endpoints

### Request Verification Code
```http
POST /auth/request-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "ok": true,
  "message": "Verification code sent via email",
  "emailSent": true
}
```

### Verify Code
```http
POST /auth/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "12345"
}
```

**Response**:
```json
{
  "ok": true,
  "message": "Code verified",
  "id": "user-id",
  "token": "jwt-token-here"
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

### Email Verification Errors
- **401 Unauthorized**: Email not found in ticket list
- **403 Forbidden**: Invalid verification code
- **404 Not Found**: Email not found during verification

### Authentication Errors
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Token expired or username mismatch
- **404 Not Found**: Standard route not found response

### Mailer Service Errors
If email sending fails, the system automatically falls back to console logging with detailed error messages for debugging.

## Security Considerations

1. **Token Security**: JWT tokens should be stored securely (HTTP-only cookies recommended)
2. **Secret Rotation**: Regularly rotate the `TOKEN_SECRET` environment variable
3. **Token Expiration**: Implement token expiration for enhanced security
4. **Role-Based Access**: Consider adding role-based authorization for sensitive endpoints

## Testing Authentication

### Testing Email Verification
1. **Request Code**: Send POST request to `/auth/request-verification` with a valid email
2. **Check Logs**: Monitor console for email delivery status or backup code
3. **Verify Code**: Send POST request to `/auth/verify` with the correct code
4. **Check Response**: Verify JWT token is returned in response

### Testing Authentication System
1. Obtain a valid JWT token from the auth endpoints
2. Include it in the `Authorization: Bearer <token>` header
3. Verify endpoints return proper responses for both valid and invalid tokens

### Debugging Tips
- Check server logs for detailed email sending status
- Use console backup codes if email delivery fails
- Monitor for data type issues in verification code comparison
- Verify environment variables are correctly set


---


# Old version:
This section below shows the previous version of the authentication endpoints, before recent changes, for reference.

## API Reference - Authentication

- [Verify Account](#verify-account)
- [Verification](#verification)
- [Update Password](#update-password)
- [Login](#login)

---

#### Verify Account

```HTTP
POST /api/request-verification
```

Verifies if the email is in the ticket list. If it is, sends a verification code to the email.

**TEMPORARY**:
(For testing check the code in the console, or change the email constant in server/auth/auth.service.mjs)

**Body content**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| email | no   | `STRING` | The email of the user. |

<br>

#### Verification

```HTTP
POST /api/verify
```

Verifies the account with the verification code and returns a JWT Token and the user ID.

**Body content**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| email | no   | `STRING` | The email of the user. |
| code | no   | `STRING` | Verification code. |

<br>

#### Update Password

```HTTP
PUT /api/password
```

Updates the password of the user.

Note: Needs the additional request header containing the JWT token of the user
(i.e. Authorization: Bearer eyJhbGciOiJI...) .

**Body content**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| email | no   | `STRING` | The email of the user. |
| password | no   | `STRING` | New password. |

<br>

#### Login

```HTTP
POST /api/login
```
Logs in the user and returns a JWT Token and the user ID.

**Body content**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| email | no   | `STRING` | The email of the user. |
| password | no   | `STRING` | The password of the user. |
