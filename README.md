# API Reference

- [Authentication](#authentication)

  - [Register account](#register-account)
  - [Log in](#log-in)
  - [Log out](#log-out)

- [Users](#users)

  - [Get user](#get-user)
  - [Update user](#update-user)
  - [Add event to user schedule](#add-event-to-user-schedule)
  - [Remove event from user schedule](#remove-event-from-user-schedule)
  - [Get user schedule](#get-user-schedule)
  - [Send user connection request](#send-user-connection-request)
  - [Get user connection requests](#get-user-connection-requests)
  - [Accept/Deny user connection request](#accept/deny-user-connection-request)
  - [Delete user connection](#delete-user-connection)
  - [Get user connections](#get-user-connections)
  - [Get user notifications](#get-user-notifications)
  - [Get user recommendations](#get-user-recommendations)
  - [Search users](#search-users)

- [Attendees](#attendees)

  - [Get attendee awards](#get-attendee-awards)
  - [Get attendee contacts](#get-attendee-contacts)
  - [Get attendee certificates](#get-attendee-certificates)
  - [Get attendee ticket](#get-attendee-ticket)
  - [Create attendee question](#create-attendee-question)
  - [Get attendee questions](#get-attendee-questions)
  - [Send attendee CV to partner](#send-attendee-cv-to-partner)
  - [Get partners followed by attendee](#get-partners-followed-by-attendee)

- [Partners](#partners)

  - [Get partner](#get-partner)

- [Events](#events)

  - [Get event](#get-event)
  - [Get event questions](#get-event-questions)
  - [Get event participants](#get-event-participants)
  - [Search event](#search-events)

- [Admin](#admin)
  - [Get all users](#get-all-users)

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

#### Get user

```HTTP
GET /api/users/{username}
```

Returns the user identified by **username**.

<br>

#### Update user

```HTTP
PUT /api/users/{username}
```

Updates the user identified by **username** and returns it.

<br>

#### Add event to user schedule

```HTTP
POST /api/users/{username}/events
```

Adds an event to the schedule of the user identified by **username**.

<br>
    
#### Remove event from user schedule

```HTTP
DELETE /api/users/{username}/events/{id}
```

Removes event identified by **id** from the schedule of the user identified by **username**.

<br>

#### Get user schedule

```HTTP
GET /api/users/{username}/events
```

Returns the schedule of the user identified by **username**.

<br>

#### Send user connection request

```HTTP
POST /api/users/{username}/requests
```

Creates a connection request sent by the user identified by **username** to another user in the application system.

**Query parameters**

| Param   | Optional | Type   | Description                                                                     |
| :------ | -------- | :----- | :------------------------------------------------------------------------------ |
| partner | yes      | `BOOL` | If `partner=True` starts following a partner. Else, sends a connection request. |

<br>

#### Get user connection requests

```HTTP
GET /api/users/{username}/requests
```

Returns the connection requests of the user identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                                             |
| :-------- | -------- | :----- | :------------------------------------------------------------------------------------------------------ |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                                              |
| sent      | yes      | `BOOL` | If `sent=True` then searches for only sent requests. Else, searches for all connection requests         |
| received  | yes      | `BOOL` | If `received=True` then searches for only received requests. Else, searches for all connection requests |

<br>

#### Accept/Deny user connection request

```HTTP
DELETE /api/users/{username}/resquests/{id}
```

Accepts or denies the received connection request identified by **id** of the user identified by **username**.

**Query parameters**

| Param     | Optional | Type   | Description                                                                          |
| :-------- | -------- | :----- | :----------------------------------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect.                           |
| deny      | yes      | `BOOL` | If `deny=True`, deletes the received connections request. Else, accepts the request. |

<br>

#### Delete user connection

```HTTP
DELETE /api/users/{username}/connection/{id}
```

Delete the connection identified by **id** of the user identified by **username**.

**Query parameters**

| Param   | Optional | Type   | Description                                                              |
| :------ | -------- | :----- | :----------------------------------------------------------------------- |
| partner | yes      | `BOOL` | If `partner=True` stops following a partner. Else, deletes a connection. |

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

### Attendees

#### Get attendee awards

```HTTP
GET /api/attendees/{username}/awards
```

Returns the awards of the attendee identified by **username**.

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

#### Get attendee certificates

```HTTP
GET /api/attendees/{username}/certificates
```

Returns the certificates of the attendee identified by **username**.

<br>

#### Get attendee ticket

```HTTP
GET /api/attendees/{username}/ticket
```

Returns the ticket of the attendee identified by **username**.

<br>

#### Create attendee question

```HTTP
GET /api/attendees/{username}/ticket
```

Creates a question made by the attendee identified by **username**.

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

#### Send attendee CV to partner

```HTTP
GET /api/attendees/{username}/partners/{id}
```

Sends the CV of the attendee identified by **username** to the partner identified by **id**.

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

### Events

#### Get event

```HTTP
GET /api/events/{id}
```

Returns the event identified by **id**.

<br>

#### Get event questions

```HTTP
GET /api/events/{id}/questions
```

Returns the questions of the event identified by **id**.

<br>

#### Get event participants

```HTTP
GET /api/events/{id}/participants
```

Returns the participants of the event identified by **id**.

<br>

#### Search events

```HTTP
GET /api/events
```

Returns a list of events in the application system.

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

### Admin

#### Get all users

```HTTP
GET /api/admin/users
```
