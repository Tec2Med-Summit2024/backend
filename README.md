# Application Notes

Some general notes about the model and design of the application:

- Users can be participants or partners
- Participants can be attendees, speakers, instructors or speakers and instructors (both).

# API Reference

- [Authentication](#authentication)

  - [Verify Account](#Verify-Account)
  - [Verification](#verification)
  - [Update password](#update-password)
  - [Login](#login)

- [Users](#users)

  - [Get user ticket](#get-user-ticket)
  - [Get user qrcode](#get-user-qrcode)
  - [Get user schedule](#get-user-schedule)
  - [Get user connections](#get-user-connections)
  - [Get user notifications](#get-user-notifications)
  - [Search users](#search-users)
  - [Update settings](#update-settings)

- [Participants](#participants)

  - [Get participant](#get-participant)
  - [Update participant](#update-participant)
  - [Add event to participant schedule](#add-event-to-participant-schedule)
  - [Remove event from participant schedule](#remove-event-from-participant-schedule)
  - [Send participant connection request](#send-participant-connection-request)
  - [Get participant connection requests](#get-participant-connection-requests)
  - [Accept/Deny participant connection request](#accept/deny-participant-connection-request)
  - [Delete participant connection](#delete-participant-connection)
  - [Get participant contacts](#get-participant-contacts)
  - [Add participant certificate](#add-participant-certificate)
  - [Get participant certificate](#get-participant-certificate)
  - [Get participant certificates](#get-participant-certificates)
  - [Get participant questions](#get-participant-questions)
  - [Get partners followed by participant](#get-partners-followed-by-participant)

- [Partners](#partners)

  - [Get partner](#get-partner)
  - [Send CV to partner](#send-cv-to-partner)
  - [Get received CV](#get-received-CV)
  - [Get all received CV](#get-all-received-CV)

- [Events](#events)

  - [Get events](#get-events)
  - [Get event](#get-event)
  - [Send question to event](#send-question-to-event)
  - [Get event questions](#get-event-questions)
  - [Send event satisfaction score](#send-event-satisfaction-score)

- [Admin](#admin)
  - [Get all users](#get-all-users)
  - [Get event participants](#get-event-participants)

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




### Users

<br>

#### Get user ticket

```HTTP
GET /api/users/{username}/ticket
```

Returns the ticket of the user identified by **username**.

<br>

#### Get user qrcode

```HTTP
GET /api/users/{username}/qrcode
```

Returns the qrcode of the user identified by **username**.

<br>

#### Get user schedule

```HTTP
GET /api/users/{username}/events
```

Returns the schedule of the user identified by **username**.

<br>

#### Get user connections

```HTTP
GET /api/users/{username}/connections
```

Returns the connections of the user identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Get user notifications

```HTTP
GET /api/users/{username}/notifications
```

Returns the notifications of the user identified by **username**.

<br>


#### Search users

```HTTP
GET /api/users
```

Returns a list of users in the application system.

**Query parameters**

| Param | Optional | Type     | Description                                                                                                         |
| :---- | -------- | :------- | :------------------------------------------------------------------------------------------------------------------ |
| name  | yes      | `String` | The name of the user. Searches for users whose name matches a substring beginning from the start of the given name. 
| type  | no       | `String` | The type of the user. Possible types are: `attendee`, `partner`, `instructor`,  `speaker`. |

<br>

#### Update settings

```HTTP
PUT /api/users/{username}/settings
```

Updates the settings of the user identified by **username**.

<br>

### Participants

#### Get participant

```HTTP
GET /api/participants/{username}
```

Returns the participant identified by **username**.

<br>

#### Update participant

```HTTP
PUT /api/participants/{username}
```

Updates the participant identified by **username** and returns it. Only works for normal participant.

<br>

#### Add event to participant schedule

```HTTP
POST /api/participants/{username}/events
```

Adds an event to the schedule of the participant identified by **username**.

<br>
    
#### Remove event from participant schedule

```HTTP
DELETE /api/participants/{username}/events/{id}
```

Removes event identified by **id** from the schedule of the participant identified by **username**.

<br>

#### Send participant connection request

```HTTP
POST /api/participants/{username}/requests
```

Creates a connection request sent by the participant identified by **username** to another participant in the application system.

**Query parameters**

| Param   | Optional | Type   | Description                                                                     |
| :------ | -------- | :----- | :------------------------------------------------------------------------------ |
| partner | yes      | `BOOL` | If `partner=True` starts following a partner. Else, sends a connection request. |

<br>

#### Get participant connection requests

```HTTP
GET /api/participants/{username}/requests
```

Returns the connection requests of the participant identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                                             |
| :-------- | -------- | :----- | :------------------------------------------------------------------------------------------------------ |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                                              |
| sent      | yes      | `BOOL` | If `sent=True` then searches for only sent requests. Else, searches for all connection requests         |
| received  | yes      | `BOOL` | If `received=True` then searches for only received requests. Else, searches for all connection requests |

<br>

#### Accept/Deny participant connection request

```HTTP
DELETE /api/participants/{username}/requests/{id}
```

Accepts or denies the received connection request identified by **id** of the participant identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                          |
| :-------- | -------- | :----- | :----------------------------------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                           |
| deny      | yes      | `BOOL` | If `deny=True`, deletes the received connections request. Else, accepts the request. |

<br>

#### Delete participant connection

```HTTP
DELETE /api/participants/{username}/connections/{id}
```

Delete the connection identified by **id** of the participant identified by **username**.

**Query parameters**

| Param   | Optional | Type   | Description                                                              |
| :------ | -------- | :----- | :----------------------------------------------------------------------- |
| partner | yes      | `BOOL` | If `partner=True` stops following a partner. Else, deletes a connection. |

<br>

#### Get participant contacts

```HTTP
GET /api/participants/{username}/contacts
```

Returns the contacts of the participant identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Add participant certificate

<!-- MAYBE NOT NECESSARY BECAUSE THE SYSTEM CAN ADD A CERTIFICATE INTERNALLY WHEN THE LOGGED USERS SENDS THE SATISFACTION SCORE -->

```HTTP
POST /api/participants/{username}/certificates
```

Add a new certificate to the collections of certificates of the participant identified by **username**.

<br>

#### Get participant certificate

```HTTP
GET /api/participants/{username}/certificates/{id}
```

Returns the certificate identified by **id** of the participant identified by **username**.

<br>

#### Get participant certificates

```HTTP
GET /api/participants/{username}/certificates
```

Returns the certificates of the participant identified by **username**.

<br>

#### Get participant questions

```HTTP
GET /api/participants/{username}/questions
```

Returns the questions of the participant identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Get partners followed by participant

```HTTP
GET /api/participants/{username}/partners
```

Returns the partners followed by the participant identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

### Partners

#### Get partner

```HTTP
GET /api/partners/{username}
```

Returns the partner identified by **username**.

<br>

#### Send CV to partner

```HTTP
POST /api/partners/{username}/cvs
```

Sends the CV of the logged participant to the partner identified by **username**.

<br>

#### Get received CV

```HTTP
GET /api/partners/{username}/cvs/{id}
```

Returns the CV identified by **id** sent to the partner identified by **username**.

<br>

#### Get all received CV

```HTTP
POST /api/partners/{username}/cvs
```

Gets all the CVs sent to the given partner identified by **username**.

<br>

### Events

#### Get Events

```HTTP
GET /api/events
```

Returns all the events of the authorized user

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| query | ✅ | `STRING` | Query to search for in the event |
| start | ✅ | `STRING` | All events that start before the specified time will be omitted. Format: yyyy/MM/ddThh:mm|
| end   | ✅ | `STRING` | All events that end after the specified time will be omitted. Format: yyyy/MM/ddThh:mm  |

<br />

#### Get event

```HTTP
GET /api/events/{id}
```

Returns the event identified by **id**.

<br>

#### Send question to event

```HTTP
POST /api/events/{id}/questions
```

Sends a question made by the logged participant to the event identified by **id**.

<br>

#### Get event questions

```HTTP
GET /api/events/{id}/questions
```

Returns the questions of the event identified by **id**.

<br>

#### Send event satisfaction score

```HTTP
POST /api/events/{id}/score
```

Sends the satisfaction score given by the logged user to the event identified by **id**.

<br>

### Admin

#### Get all users

```HTTP
GET /api/admin/users
```

Description

<br>

#### Get event participants

```HTTP
GET /api/events/{id}/participants
```

Returns the participants of the event identified by **id**.

<br>
