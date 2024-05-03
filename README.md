# Application Notes

Some general notes about the model and design of the application:

- Users can be attendees or partners
- Attendes can be normal attendes, speakers, instructors or speakers and instructors (both). 

# API Reference

- [Authentication](#authentication)

  - [Register account](#register-account)
  - [Log in](#log-in)
  - [Log out](#log-out)

- [Users](#users)
  - [Get user schedule](#get-user-schedule)
  - [Get user connections](#get-user-connections)
  - [Get user notifications](#get-user-notifications)
  - [Get user recommendations](#get-user-recommendations)
  - [Search users](#search-users)

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
  - [Get attendee certificates](#get-attendee-certificates)
  - [Get attendee ticket](#get-attendee-ticket)
  - [Create attendee question](#create-attendee-question)
  - [Get attendee questions](#get-attendee-questions)
  - [Get partners followed by attendee](#get-partners-followed-by-attendee)

- [Partners](#partners)
  - [Get partner](#get-partner)
  - [Update partner](#update-partner)
  - [Send CV to partner](#send-cv-to-partner)  

- [Events](#events)

  - [Get event](#get-event)
  - [Get event questions](#get-event-questions)
  - [Get event participants](#get-event-participants)
  - [Search events](#search-events)

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

Updates the attendee identified by **username** and returns it.

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
DELETE /api/attendees/{username}/resquests/{id}
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

#### Update partner

```HTTP
PUT /api/partners/{username}
```

Updates the partner identified by **username** and returns it.

<br>

#### Send CV to partner

```HTTP
POST /api/partners/{username}/cvs
```

Sends a CV to the partner identified by **id**.

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
