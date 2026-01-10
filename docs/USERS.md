# API Reference - Users

- [Get user ticket](#get-user-ticket)
- [Get user qrcode](#get-user-qrcode)
- [Get user schedule](#get-user-schedule)
- [Get user notifications](#get-user-notifications)
- [Search users](#search-users)
- [Update settings](#update-settings)

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
