# API Reference

- [Partners](#partners)

  - [Get partner](#get-partner)
  - [Send CV to partner](#send-cv-to-partner)
  - [Get received CV](#get-received-CV)
  - [Get all received CV](#get-all-received-CV)
  - [Get partners followed by partner](#Get-partners-followed-by-partner)

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
