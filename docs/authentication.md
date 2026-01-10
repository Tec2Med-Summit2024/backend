# API Reference

- [Authentication](#authentication)

  - [Verify Account](#Verify-Account)
  - [Verification](#verification)
  - [Update password](#update-password)
  - [Login](#login)

### Authentication

#### Verify Account

```HTTP
POST /api/request-verification
```

Verifies if the email is in the ticket list. If it is, sends a verification code to the email.

### TEMPORARY:
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

#### Update password

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
