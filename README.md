# Application Notes

Some general notes about the model and design of the application:

- Users can be attendees or partners
- Attendees can be normal attendees, speakers, instructors or speakers and instructors (both).

# API Reference

- [Authentication](#authentication)

  - [Register account](#register-account)
  - [Log in](#log-in)
  - [Log out](#log-out)

- [Users](#users)

  - [Get user ticket](#get-user-ticket)
  - [Get user qrcode](#get-user-qrcode)
  - [Get user schedule](#get-user-schedule)
  - [Get user connections](#get-user-connections)
  - [Get user notifications](#get-user-notifications)
  - [Get user recommendations](#get-user-recommendations)
  - [Search users](#search-users)
  - [Update settings](#update-settings)

- [Attendees](#attendees)

  - [Get attendee](#get-attendee)
  - [Update attendee](#update-attendee)
  - [Add event to attendee schedule](#add-event-to-attendee-schedule)
  - [Remove event from attendee schedule](#remove-event-from-attendee-schedule)
  - [Send attendee connection request](#send-attendee-connection-request)
  - [Get attendee connection requests](#get-attendee-connection-requests)
  - [Accept/Deny attendee connection request](#accept/deny-attendee-connection-request)
  - [Delete attendee connection](#delete-attendee-connection)
  - [Get attendee contacts](#get-attendee-contacts)
  - [Add attendee certificate](#add-attendee-certificate)
  - [Get attendee certificate](#get-attendee-certificate)
  - [Get attendee certificates](#get-attendee-certificates)
  - [Get attendee questions](#get-attendee-questions)
  - [Get partners followed by attendee](#get-partners-followed-by-attendee)

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

#### Register account

```HTTP
POST /api/register
```

Creates an account in the application system and returns the account id.

<br>

#### Log in

```HTTP
POST /api/login
```

Logs in an account in the application system.

#### Log out

```HTTP
POST /api/logout
```

Logs out an account in the application system.

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

#### Get user recommendations

```HTTP
GET /api/users/{username}/recommendations
```

Returns the recommendations of the user identified by **username**.

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

<br>

#### Update settings

```HTTP
PUT /api/users/{username}/settings
```

Updates the settings of the user identified by **username**.

<br>

### Attendees

#### Get attendee

```HTTP
GET /api/attendees/{username}
```

Returns the attendee identified by **username**.

<br>

#### Update attendee

```HTTP
PUT /api/attendees/{username}
```

Updates the attendee identified by **username** and returns it. Only works for normal attendee.

<br>

#### Add event to attendee schedule

```HTTP
POST /api/attendees/{username}/events
```

Adds an event to the schedule of the attendee identified by **username**.

<br>
    
#### Remove event from attendee schedule

```HTTP
DELETE /api/attendees/{username}/events/{id}
```

Removes event identified by **id** from the schedule of the attendee identified by **username**.

<br>

#### Send attendee connection request

```HTTP
POST /api/attendees/{username}/requests
```

Creates a connection request sent by the attendee identified by **username** to another attendee in the application system.

**Query parameters**

| Param   | Optional | Type   | Description                                                                     |
| :------ | -------- | :----- | :------------------------------------------------------------------------------ |
| partner | yes      | `BOOL` | If `partner=True` starts following a partner. Else, sends a connection request. |

<br>

#### Get attendee connection requests

```HTTP
GET /api/attendees/{username}/requests
```

Returns the connection requests of the attendee identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                                             |
| :-------- | -------- | :----- | :------------------------------------------------------------------------------------------------------ |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                                              |
| sent      | yes      | `BOOL` | If `sent=True` then searches for only sent requests. Else, searches for all connection requests         |
| received  | yes      | `BOOL` | If `received=True` then searches for only received requests. Else, searches for all connection requests |

<br>

#### Accept/Deny attendee connection request

```HTTP
DELETE /api/attendees/{username}/requests/{id}
```

Accepts or denies the received connection request identified by **id** of the attendee identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                          |
| :-------- | -------- | :----- | :----------------------------------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                           |
| deny      | yes      | `BOOL` | If `deny=True`, deletes the received connections request. Else, accepts the request. |

<br>

#### Delete attendee connection

```HTTP
DELETE /api/attendees/{username}/connection/{id}
```

Delete the connection identified by **id** of the attendee identified by **username**.

**Query parameters**

| Param   | Optional | Type   | Description                                                              |
| :------ | -------- | :----- | :----------------------------------------------------------------------- |
| partner | yes      | `BOOL` | If `partner=True` stops following a partner. Else, deletes a connection. |

<br>

#### Get attendee contacts

```HTTP
GET /api/attendees/{username}/contacts
```

Returns the contacts of the attendee identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Add attendee certificate

<!-- MAYBE NOT NECESSARY BECAUSE THE SYSTEM CAN ADD A CERTIFICATE INTERNALLY WHEN THE LOGGED USERS SENDS THE SATISFACTION SCORE -->

```HTTP
POST /api/attendees/{username}/certificates
```

Add a new certificate to the collections of certificates of the attendee identified by **username**.

<br>

#### Get attendee certificate

```HTTP
GET /api/attendees/{username}/certificates/{id}
```

Returns the certificate identified by **id** of the attendee identified by **username**.

<br>

#### Get attendee certificates

```HTTP
GET /api/attendees/{username}/certificates
```

Returns the certificates of the attendee identified by **username**.

<br>

#### Get attendee questions

```HTTP
GET /api/attendees/{username}/questions
```

Returns the questions of the attendee identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Get partners followed by attendee

```HTTP
GET /api/attendees/{username}/partners
```

Returns the partners followed by the attendee identified by **username**.

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

Sends the CV of the logged attendee to the partner identified by **username**.

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
| start | ✅ | `DATE` | All events that start before the specified time will be omitted |
| end   | ✅ | `DATE` | All events that end after the specified time will be omitted  |

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

Sends a question made by the logged attendee to the event identified by **id**.

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
