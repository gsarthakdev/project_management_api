# Testing Plan for Project Management API

This testing plan provides step-by-step instructions to verify the API endpoints using **Swagger UI**.

## Preparation

Go to the following link: [https://project-management-api-kz1p.onrender.com/api-docs](https://project-management-api-kz1p.onrender.com/api-docs)

### Note: 
- The database has been seeded with two users:
- **Admin**: `admin@example.com` / `Password123!`
- **Regular User**: `user@example.com` / `userpassword321`

---

## 1. Operational Endpoints

### 1.1 GET `/health`
**Access Control:** Public
1. Expand `GET /health`, click **Try it out**.
2. **Success Case (200 OK):**
   - Click Execute. *Expect 200 OK and JSON indicating the status is "ok".*

---

## 2. Authentication Endpoints

### 2.1 POST `/api/auth/signup`
**Access Control:** Public
1. Expand `POST /api/auth/signup`, click **Try it out**.
2. **Success Case (201 Created):**
   - Provide body:
     ```json
     {
       "email": "newuser@example.com",
       "password": "Password123!",
       "name": "New User"
     }
     ```
   - Click Execute. *Expect 201 Created and JSON including the user's ID, name, and email.*
3. **409 Conflict:**
   - Leave the exact same body from step 2 and click Execute again. *Expect 409 Conflict.*
4. **400 Bad Request:**
   - Remove the `"email"` field from the body and click Execute. *Expect 400 Bad Request (Validation failed).*

### 2.2 POST `/api/auth/login`
**Access Control:** Public
1. Expand `POST /api/auth/login`, click **Try it out**.
2. **Success Case (200 OK):**
   - Provide body:
     ```json
     {
       "email": "admin@example.com",
       "password": "Password123!"
     }
     ```
   - Click Execute. *Expect 200 OK and a JSON object containing a `token`.*
   - **Important setup for following steps:** Copy the `token` string (without quotes). Scroll to the top of Swagger UI, click **Authorize**, paste the token into the `bearerAuth` field, and click **Authorize**.

3. **401 Unauthorized:**
   - Provide body with a wrong password:
     ```json
     {
       "email": "admin@example.com",
       "password": "WrongPassword!"
     }
     ```
   - Click Execute. *Expect 401 Unauthorized.*

---

## 3. Project Endpoints

*Ensure you are Authorized in Swagger with `admin@example.com`'s JWT.*

### 3.1 POST `/api/projects`
**Access Control:** Authenticated User
1. Expand `POST /api/projects`, click **Try it out**.
2. **Success (201 Created):**
   - Provide body:
     ```json
     {
       "name": "Test Project",
       "description": "A new test project"
     }
     ```
   - Click Execute. *Expect 201 Created.*
3. **409 Conflict:**
   - Submit the identical request body again. *Expect 409 Conflict.*
4. **400 Bad Request:**
   - Remove the `"name"` field and execute. *Expect 400 Bad Request.*
5. **401 Unauthorized:**
   - Log out from the `Authorize` button at the top of Swagger, and execute. *Expect 401 Unauthorized.* *(Re-authorize as Admin after this!)*

### 3.2 GET `/api/projects`
**Access Control:** Authenticated User
1. Expand `GET /api/projects`, click **Try it out**.
2. **Success (200 OK):**
   - Click Execute. *Expect 200 OK and an array of projects the user is a member of (including "Global Product Launch").*

### 3.3 GET `/api/projects/{id}`
**Access Control:** Member of Project
1. Expand `GET /api/projects/{id}`, click **Try it out**.
2. **Success (200 OK):**
   - Set `id` parameter to `1` (Global Product Launch).
   - Click Execute. *Expect 200 OK and the project details including members and tasks.*
3. **404 Not Found:**
   - Set `id` to `999`. Execute. *Expect 404 Not Found.*
4. **403 Forbidden:**
   - Stay logged in as Admin, create a project. The Regular User is not part of it. Log in as Regular User, attempt to GET that project ID. *Expect 403 Forbidden.*
      - Note: These are the seeded credentials, as listed at the very top of this file.
         - **Admin**: `admin@example.com` / `Password123!`
         - **Regular User**: `user@example.com` / `userpassword321`

### 3.4 PUT `/api/projects/{id}`
**Access Control:** Admin/Owner of Project
1. Expand `PUT /api/projects/{id}`, click **Try it out**.
2. **Success (200 OK):**
   - Assume `id` is `1` (Admin is Owner). 
   - Body:
     ```json
     { "name": "Global Product Launch V2" }
     ```
   - Execute. *Expect 200 OK updated object.*
3. **403 Forbidden:**
   - Make sure you are Authorized as `admin@example.com`.
   - Set `id` to `2` (Project 2 is owned by the Regular User, and the Admin is not a member of it).
   - Click Execute. *Expect 403 Forbidden.*

### 3.5 DELETE `/api/projects/{id}`
**Access Control:** Owner of Project
1. Expand `DELETE /api/projects/{id}`, click **Try it out**.
2. **403 Forbidden:**
   - Authorize as `user@example.com`. 
   - Set `id` to `1` (Regular User is Admin, but NOT Owner of Project 1). Execute. *Expect 403 Forbidden.*
3. **Success (204 No Content):**
   - Authorize as `admin@example.com`.
   - Set `id` to the ID of the "Test Project" you created in step 3.1 (e.g., `3`). Execute. *Expect 204 No Content.*
   - *(Note: Do not delete Project 1, as subsequent tests depend on its tasks and comments!)*

---

## 4. Task Endpoints

*Ensure you have an active JWT for `admin@example.com` in the Authorize menu.*

### 4.1 POST `/api/tasks`
**Access Control:** Member of Project
1. Expand `POST /api/tasks`, click **Try it out**.
2. **Success (201 Created):**
   - Provide body:
     ```json
     {
       "title": "New Task",
       "projectId": 1
     }
     ```
     *(Assuming Project 2 exists and user is a member of it. You will see Project 1 if 2 isn't applicable due to prior operations)*
   - Execute. *Expect 201 Created.*
3. **409 Conflict:**
   - Execute the same body again. *Expect 409 Conflict.*
4. **403 Forbidden:**
   - Attempt to provide a `projectId` the user does not belong to. *Expect 403 Forbidden.*

### 4.2 GET `/api/tasks`
**Access Control:** Authenticated User
1. Expand `GET /api/tasks`, click **Try it out**.
2. **Success (200 OK):**
   - Click Execute. *Expect 200 OK and an array of tasks assigned to the user.*

### 4.3 GET `/api/tasks/{id}`
**Access Control:** Member of the Parent Project
1. Expand `GET /api/tasks/{id}`, click Try it out.
2. Provide `id` `1`.
3. Execute. *Expect 200 OK.*

### 4.4 PUT `/api/tasks/{id}`
**Access Control:** Member of Project
1. Expand `PUT /api/tasks/{id}`, click **Try it out**.
2. **Success (200 OK):**
   - Provide `id` `1`.
   - Provide body:
     ```json
     {
       "title": "Updated Task Title",
       "status": "In Progress"
     }
     ```
   - Execute. *Expect 200 OK updated task.*
3. **404 Not Found:**
   - Set `id` to `999`. Execute. *Expect 404 Not Found.*
4. **403 Forbidden:**
   - Authorize as `user@example.com` and set `id` to a task in a project the user has no access to.
   - Execute. *Expect 403 Forbidden.*

### 4.5 DELETE `/api/tasks/{id}`
**Access Control:** Project Admin/Owner
1. Expand `DELETE /api/tasks/{id}`, click Try it out.
2. Provide `id` of the "New Task" you created in step 4.1 (e.g., `3`).
   *(Note: Do not delete Task 1, as subsequent tests depend on its comments!)*
3. Execute. *Expect 204 No Content.*

---

## 5. Comment Endpoints

### 5.1 POST `/api/comments`
**Access Control:** Member of the Task's Project
1. Expand `POST /api/comments`, click **Try it out**.
2. **Success (201 Created):**
   - Provide Body:
     ```json
     {
       "content": "This is a great task",
       "taskId": 1
     }
     ```
   - Execute. *Expect 201 Created.*

### 5.2 GET `/api/comments`
**Access Control:** Authenticated User
1. Expand `GET /api/comments`, click **Try it out**.
2. **Success (200 OK):**
   - Click Execute. *Expect 200 OK and an array of comments authored by the user.*

### 5.3 GET `/api/comments/{id}`
**Access Control:** Member of the Task's Project
1. Expand `GET /api/comments/{id}`, click **Try it out**.
2. **Success (200 OK):**
   - Set `id` to `1`.
   - Click Execute. *Expect 200 OK and the comment details.*
3. **404 Not Found:**
   - Set `id` to `999`. Execute. *Expect 404 Not Found.*
4. **403 Forbidden:**
   - Authorize as a user who doesn't have access to the parent project and try to access the comment. Execute. *Expect 403 Forbidden.*

### 5.4 PUT `/api/comments/{id}`
**Access Control:** Original Author ONLY
1. Authorize as `admin@example.com`.
2. Expand `PUT /api/comments/{id}`, set `id` to `2` (Comment 2 was authored by Regular User).
3. Body: `{ "content": "Hacked comment" }`
4. Execute. *Expect 403 Forbidden.*
5. Set `id` to `1` (Comment 1 authored by Admin).
6. Body: `{ "content": "Updated comment text" }`
7. Execute. *Expect 200 OK.*

### 5.5 DELETE `/api/comments/{id}`
**Access Control:** Original Author OR Project Owner
1. **Success (204 No Content):**
   - Authorize as `admin@example.com`.
   - Set `id` to `1` (Owned by Admin). Execute. *Expect 204 No Content.*
   - Set `id` to `2` (Authored by Regular User, but Admin is the Project Owner). Execute. *Expect 204 No Content.*
