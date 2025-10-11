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
  - [Get user notifications](#get-user-notifications)
  - [Search users](#search-users)
  - [Update settings](#update-settings)

- [Participants](#participants)

  - [Get participant](#get-participant)
  - [Update participant](#update-participant)
  - [Add event to participant schedule](#add-event-to-participant-schedule)
  - [Remove event from participant schedule](#remove-event-from-participant-schedule)
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
  - [Get partners followed by partner](#Get-partners-followed-by-partner)

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

#### Get user type

```HTTP
GET /api/users/{username}/type
```

Returns the list of types of the user identified by **username**.

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
| name  | yes      | `String` | The name of the user. Searches for users whose name matches a substring beginning from the start of the given name. |
| type  | no       | `String` | The type of the user. Possible types are: `attendee`, `partner`, `instructor`,  `speaker`. |
| location | yes      | `String` | The current location of the user. Searches for users whose current_location matches a substring beginning from the start of the given location. |
| field | yes      | `String` | The work/study field of the user. Searches for users whose field_of_study_work_research matches a substring beginning from the start of the given field.| 
| institution | yes      | `String` | The institution of the user. Searches for users whose institution matches a substring beginning from the start of the given institution. |
| interests| yes      | `String` | The interests of the user. Searches for users whose interests match the given list of interests. |
| expertises| yes      | `String` | The expertises of the user. Searches for users whose expertises match the given list of expertises. |

Note: The interests and expertises parameters are lists of exact interests/expertises in the form of ; seperated values (i.e. &interests=3D Printing;Data modelling)


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

#### Get partners followed by partner

```HTTP
GET /api/partners/{username}/followers
```

Returns the partners followed by the partner identified by **username**.

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
| start | ✅ | `STRING` | All events that start before the specified time will be omitted. Format: YYYY-MM-DDTHH:mm|
| end   | ✅ | `STRING` | All events that end after the specified time will be omitted. Format: YYYY-MM-DDTHH:mm  |
| type   | ✅ | `STRING` | All events of the specified type. Possible values: "Talk", "Masterclass", "Debate", "Roundtable", "Workshop".  |
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

**Body content**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| content | no   | `STRING` | The content of the question. |

<br>

#### Get event questions

```HTTP
GET /api/events/{id}/questions
```

Returns the questions of the event identified by **id**. The endpoint uses the authenticated user to determine which questions have been liked by the user.

<br>

#### Send event feedback

```HTTP
POST /api/events/{id}/feedback
```

Sends the feedback given by the logged user to the event identified by **id**.

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
