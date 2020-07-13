# Tau connect API docs

Every route return a JSON object whit a "data" or "msg" property

## Endpoints

- Auth routes (/auth)
  - Login (POST: /login)
  - Register (POST: /register)
  - Change Password (PUT: /change-password)
- Posts routes (/posts)
  - All (GET: /)
  - One (GET: /:id)
  - New post (POST: /)
  - Delete post (DELETE: /:id)
  - Like post (PUT: /like/:id)
  - Post comment (PUT: /comment/:id)
  - Get comments (GET: /comments)
- User routes (/users)
  - All (GET: /)
  - One (GET: /:id)
  - Update (PUT: /:id)
  - Follow (PUT: /follow)
  - Remove (DELETE: /:id)

## Endpoints description
- ## Auth (/auth)
### Login (POST: /login)
Login as an user

Require: 
```js
{
	"email": "paolodydtorregrosa@gmail.com",
	"password": "123456"
}
```
Return
```js
// Status 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE2ZjQ2Mzk2LTliNDQtNDYzNy1iZmJhLTdlZmUwNWJmNzM2YSIsImVtYWlsIjoicGFvbG9keWR0b3JyZWdyb3NhQGdtYWlsLmNvbSIsImlhdCI6MTU5NDY3MDE2NCwiZXhwIjoxNTk0NjkxNzY0fQ.YPt5u25y-TC-GgRrgQA0Xc9kPI5ViXexj1h5GzbtG_A",
  "data": {
    "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
    "name": "Paolo",
    "username": "@Paolinsky",
    "email": "paolodydtorregrosa@gmail.com",
    "activated": true,
    "register_at": "2020-07-13T19:55:12.412Z"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Register (POST: /register)
Creates a new user (After this you must login)

Require: 
```js
{
	"name": "Lore",
	"username": "@cute",
	"email": "cute@gmail.com",
	"password": "123456"
}
```
Return
```js
// Status 200
{
  "data": {
    "name": "Lore",
    "username": "@cute",
    "email": "cute@gmail.com",
    "activated": true,
    "register_at": "2020-07-13T19:56:00.360Z",
    "id": "3760a78d-ec2b-4ac2-b0cc-8d401468ab2a"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Change password (PUT: /change-password)
Changes the password of an user

Require: 
```js
// Auth required
{
	"oldPassword": "patatas",
	"newPassword": "123456"
}
```

Return
```js
// Status: 401
{
  "msg": "Password don't match"
}
// Status 200
{
  "msg": "Password changed"
}
```

- ## Posts (/posts)

### All (GET: /)
Get all the posts

Return: 
```js
// Status 200
{
  "data": [
    {
      "id": "6c04c8d5-b658-42ef-aa29-fe3ad89e500c",
      "body": "El primer post de esta red social",
      "created_at": "2020-07-13T18:22:41.314Z",
      "user": {
        "id": "d695fe9d-cad7-4c2b-822b-91df2596049e",
        "name": "Paolo",
        "username": "@Paolinsky",
        "email": "paolotorregrosa@gmail.com",
        "activated": true,
        "register_at": "2020-07-12T16:48:11.579Z"
      }
    },
    {
      "id": "81d86197-52af-4e21-a1df-883db92f917e",
      "body": "El segundo post de esta red social :D",
      "created_at": "2020-07-13T19:40:17.986Z",
      "user": {
        "id": "d695fe9d-cad7-4c2b-822b-91df2596049e",
        "name": "John",
        "username": "@Doe",
        "email": "dow@john.com",
        "activated": true,
        "register_at": "2020-07-12T16:48:11.579Z"
      }
    }
  ]
}
// On fail returns
{
    msg: "Error info"
}
```

### One (GET: /:id)
Requires: An ``id`` in the url

Return:
```js
// Status 200
{
  "data": {
    "id": "63a6e94b-8542-4a7d-99d9-1f2892a0fc51",
    "body": "A single post",
    "created_at": "2020-07-10T17:28:29.090Z",
    "user": {
      "id": "b075280a-07ac-406b-90ea-3e159cdede1f",
      "name": "Lore",
      "username": "@cute_gf",
      "email": "cute@gf.com",
      "activated": true,
      "register_at": "2020-07-10T16:50:10.078Z"
    }
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### New post (POST: /posts)
Creates a new post

Require: 
```js
// Requires auth
{
    "body": "A new post" 
}
```
Return:
```js
// Status 200
{
  "data": {
    "body": "El primer post de esta red social",
    "comments": [],
    "created_at": "2020-07-13T19:40:17.986Z",
    "likes": [],
    "user": {
      "id": "d695fe9d-cad7-4c2b-822b-91df2596049e",
      "name": "Paolo",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-12T16:48:11.579Z"
    },
    "id": "81d86197-52af-4e21-a1df-883db92f917e"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Delete post (DELETE: /:id)
Requires an ``id`` in the url

Return:
```js
// Status 200
{
  "msg": "Post removed"
}
// On fail returns
{
    msg: "Error info"
}
```