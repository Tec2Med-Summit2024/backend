# API Reference - Admin Panel
NOTE: Users can be participants or partners. Participants can be attendees, speakers, instructors or speakers and instructors (both).

- [Get all users](#get-all-users)
- [Get event participants](#get-event-participants)

<br>

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
