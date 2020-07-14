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

### Like post (PUT /like/:id)
Leave a like in the post whit the ``id``

Requrie an ``id`` in the url and auth

Return: 
```js

// Status 200
{
  "data": {
    "user": {
      "id": "d695fe9d-cad7-4c2b-822b-91df2596049e",
      "name": "Paolo",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-12T16:48:11.579Z"
    },
    "post": {
      "id": "6c04c8d5-b658-42ef-aa29-fe3ad89e500c",
      "body": "El primer post de esta red social",
      "created_at": "2020-07-13T18:22:41.314Z"
    },
    // This is the id like
    "id": "e6c5a696-bfa6-4510-a3b9-1402368eafb5"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Get comments (GET: /comments/:id)
Get the comments of the post whit ``id``

Require an ``id`` in the url

Return:
```js
// Status 200
{
  "data": [
    {
      "id": "32833f03-fc65-4838-9fd6-90a17de35586",
      "body": "This is a single comment",
      "created_at": "2020-07-09T21:36:09.791Z"
    },
    {
      "id": "32833f03-fc65-4838-9fd6-90a17de35586",
      "body": "This is a single comment",
      "created_at": "2020-07-09T21:36:09.791Z"
    }
  ]
}
// On fail returns
{
    msg: "Error info"
}
```
- ## Comments (/comments)
  
### One (GET: /:id)
Get a single comment

Return:
```js
// Status 200
{
  "data": {
    "id": "8b96fb70-dc59-4638-94b8-1fea9d540d4a",
    "body": "This is a comment",
    "created_at": "2020-07-14T05:21:47.922Z",
    "user": {
      "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
      "name": "Paolinsky",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-13T19:55:12.412Z"
    }
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Post comment (POST: /:id)
You must specify a  post to comment inside the url ``id``

Require:
```js
// Require auth
{
  "body": "This is a comment"
}
```
Return:
```js
// Status 200
{
  "data": {
    "body": "This is a comment",
    "post": {
      "id": "895b6a8c-8df1-4bf4-8d73-df1cb095753d",
      "body": "El primer post de esta red social",
      "created_at": "2020-07-14T00:20:25.990Z"
    },
    "user": {
      "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
      "name": "Paolinsky",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-13T19:55:12.412Z"
    },
    "id": "8b96fb70-dc59-4638-94b8-1fea9d540d4a",
    "created_at": "2020-07-14T05:21:47.922Z"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Like comment (PUT: /like/:id)
Likes the comment with the ``id`` in the url

Require auth.

Return:
```js
// Status 200
{
  "data": {
    "user": {
      "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
      "name": "Paolinsky",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-13T19:55:12.412Z"
    },
    "comment": {
      "id": "8b96fb70-dc59-4638-94b8-1fea9d540d4a",
      "body": "This is a comment",
      "created_at": "2020-07-14T05:21:47.922Z"
    },
    "id": "3d63cab9-caa4-4a35-8d0e-a67bbc232628"
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Delete comment (DELETE: /:id)
Delete the comment with ``id``

Require auth.

Return: 
```js
// Status 200
{
  "msg": "Comment removed"
}
// On fail returns
{
    msg: "Error info"
}
```

- ## Users (/users)
  
### All (GET: /)
Get all users, requires auth

```js
// Status 200
{
  "data": [
    {
      "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
      "name": "Paolo",
      "username": "@Paolinsky",
      "email": "paolodydtorregrosa@gmail.com",
      "activated": true,
      "register_at": "2020-07-13T19:55:12.412Z"
    },
    {
      "id": "3760a78d-ec2b-4ac2-b0cc-8d401468ab2a",
      "name": "Paolinsky freelancer",
      "username": "@soft_paolinsky",
      "email": "paolinskypdtn@outlook.com",
      "activated": true,
      "register_at": "2020-07-13T19:56:00.360Z"
    }
  ]
}
// On fail returns
{
    msg: "Error info"
}
```

### One (GET: /:id)
Get one user, requires auth and an ``id`` in the url
```js
// Status 200
"data": {
  "id": "d57b7da6-f94d-45bc-9bf4-0f978fe1c075",
  "name": "Test",
  "username": "@Test",
  "email": "test@test.com",
  "activated": true,
  "register_at": "2020-07-12T03:06:09.798Z"
}
// On fail returns
{
    msg: "Error info"
}
```

### Update user (PUT: /:id)
Update an user, if email or username already exists return an error

Require: 
```js
// Rrequire auth

{
  "name": "John",
  "username": "Doe",
  "activated": true
}
```

Return:
```js
// Status 200
{
  "msg": "User updated",
  "data": {
    "id": "a6f46396-9b44-4637-bfba-7efe05bf736a",
    "name": "Paolinsky",
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

### Follow (PUT /follow/)
The loged user follows the given user

Require:
```js
// Require auth
{
  "userId": "29c7e1b2-2b76-4dcb-a46e-3be6b35e8253"
}
```
Return:
```js

// The user Lore now is followed by Paolo
// Status 200
{
  "data": {
    "id": "29c7e1b2-2b76-4dcb-a46e-3be6b35e8253",
    "name": "Lore",
    "username": "@cute",
    "email": "cute@gmail.com",
    "activated": true,
    "register_at": "2020-07-13T19:23:37.538Z",
    "followers": [
      {
        "id": "d695fe9d-cad7-4c2b-822b-91df2596049e",
        "name": "Paolo",
        "username": "@Paolinsky",
        "email": "paolodydtorregrosa@gmail.com",
        "activated": true,
        "register_at": "2020-07-12T16:48:11.579Z"
      }
    ]
  }
}
// On fail returns
{
    msg: "Error info"
}
```

### Remove user (DELETE: /:id)
Removes the given user. Require auth.

Return:
```js
{
  "msg": "User removed"
}
```

- ## Likes (/likes)
### Get post likes (GET: /post/:id)
Get the likes of the post with :id

Return: 
```js
// Status 200
{
  "data": [
    {
      "id": "b2caabb8-3f14-4840-9c4d-62a786857e0d"
    },
    {
      "id": "44dec95b-427a-4479-82dd-82c5bdd71013"
    }
  ]
}
// On fail returns 
{
    msg: "Error info"
}
```

### Get comment likes (GET: /comment/:id)
Get the likes of the comment with :id

Return: 
```js
// Status 200
{
  "data": [
    {
      "id": "b2caabb8-3f14-4840-9c4d-62a786857e0d"
    },
    {
      "id": "44dec95b-427a-4479-82dd-82c5bdd71013"
    }
  ]
}
// On fail returns 
{
    msg: "Error info"
}
```

## Authorization
The routes that require auth must send in the header the token.
```
"Authorization": `Bearer ${token}`
```
