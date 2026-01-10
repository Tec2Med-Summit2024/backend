# API Reference - Participants

- [Get participant](#get-participant)
- [Update participant](#update-participant)
- [Add event to participant schedule](#add-event-to-participant-schedule)
- [Remove event from participant schedule](#remove-event-from-participant-schedule)
- [Add participant certificate](#add-participant-certificate)
- [Get participant certificate](#get-participant-certificate)
- [Get participant certificates](#get-participant-certificates)
- [Get participant questions](#get-participant-questions)
- [Get partners followed by participant](#get-partners-followed-by-participant)

---

#### Get participant
Returns the participant identified by **username**.

```HTTP
GET /api/participants/{username}
```

<br>

#### Update participant
Updates the participant identified by **username** and returns it. Only works for normal participant.

```HTTP
PUT /api/participants/{username}
```

<br>

#### Add event to participant schedule
Adds an event to the schedule of the participant identified by **username**.

```HTTP
POST /api/participants/{username}/events
```

<br>

#### Remove event from participant schedule
Removes event identified by **id** from the schedule of the participant identified by **username**.

```HTTP
DELETE /api/participants/{username}/events/{id}
```

<br>

#### Add participant certificate
Add a new certificate to the collections of certificates of the participant identified by **username**.

<!-- MAYBE NOT NECESSARY BECAUSE THE SYSTEM CAN ADD A CERTIFICATE INTERNALLY WHEN THE LOGGED USERS SENDS THE SATISFACTION SCORE -->

```HTTP
POST /api/participants/{username}/certificates
```

<br>

#### Get participant certificate
Returns the certificate identified by **id** of the participant identified by **username**.

```HTTP
GET /api/participants/{username}/certificates/{id}
```

<br>

#### Get participant certificates
Returns the certificates of the participant identified by **username**.

```HTTP
GET /api/participants/{username}/certificates
```

<br>

#### Get participant questions
Returns the questions of the participant identified by **username**.

```HTTP
GET /api/participants/{username}/questions
```

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>

#### Get partners followed by participant
Returns the partners followed by the participant identified by **username**.

```HTTP
GET /api/participants/{username}/partners
```

**Query parameters**

| Param     | Optional | Type   | Description                                                |
| :-------- | -------- | :----- | :--------------------------------------------------------- |
| parameter | yes/no   | `TYPE` | Short description of what the parameter is and its effect. |

<br>
