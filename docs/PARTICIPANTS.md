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
