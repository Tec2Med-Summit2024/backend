- [Events](#events)

  - [Get events](#get-events)
  - [Get event](#get-event)
  - [Send question to event](#send-question-to-event)
  - [Get event questions](#get-event-questions)
  - [Send event satisfaction score](#send-event-satisfaction-score)

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
