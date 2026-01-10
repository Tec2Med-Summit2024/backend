# Questions API Documentation

This document describes the API endpoints for managing questions in the events system.

## Base URL
`/api/events`

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### 1. Create a Question
**POST** `/:id/questions`

Creates a new question for a specific event.

**Request Body:**
```json
{
  "content": "What is the main topic of this talk?"
}
```

**Response:**
```json
{
  "question_id": "123q1"
}
```

### 2. Get Questions for an Event
**GET** `/:id/questions`

Retrieves all questions for a specific event, including like status for the current user.

**Response:**
```json
[
  {
    "question_id": "123q1",
    "content": "What is the main topic of this talk?",
    "likes": 5,
    "liked": true,
    "participant": {
      "name": "John Doe",
      "username": "johndoe"
    }
  }
]
```

### 3. Like a Question
**PUT** `/:id/questions/:questionId`

Increments the like count for a question and creates a LIKES_QUESTION relationship.

**Response:**
```json
{
  "question_id": "123q1",
  "content": "What is the main topic of this talk?",
  "likes": 6,
  "liked": true
}
```

### 4. Dislike a Question
**DELETE** `/:id/questions/:questionId`

Decrements the like count for a question and removes the LIKES_QUESTION relationship.

**Response:**
```json
{
  "question_id": "123q1",
  "content": "What is the main topic of this talk?",
  "likes": 5,
  "liked": false
}
```

### 5. Get Events with User Questions (Attendees)
**GET** `/questions/sent`

Retrieves all events where the current user has asked questions.

**Response:**
```json
[
  {
    "event_id": 123,
    "name": "AI in Healthcare",
    "type": "Talk",
    "start": "2024-10-10T10:00:00.000Z",
    "end": "2024-10-10T11:00:00.000Z",
    "questionCount": 3
  }
]
```

### 6. Get Events with Questions for User (Speakers/Instructors)
**GET** `/questions/received`

Retrieves all events where the current user is a speaker/instructor and has received questions.

**Response:**
```json
[
  {
    "event_id": 456,
    "name": "Machine Learning Workshop",
    "type": "Workshop",
    "start": "2024-10-12T14:00:00.000Z",
    "end": "2024-10-12T16:00:00.000Z",
    "questionCount": 7
  }
]
```

## Data Model

### Nodes
- **Question**: Contains question_id, content, and likes properties
- **Event**: Contains event details and relationships to questions
- **Participant**: Contains user information and relationships to questions

### Relationships
- **Participant ASKS Question**: Links a user to their questions
- **Question ASKED_IN Event**: Links a question to an event
- **Participant LIKES_QUESTION**: Links a user to questions they've liked

## Error Responses

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created (for POST requests)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
