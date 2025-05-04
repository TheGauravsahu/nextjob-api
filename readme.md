# NextJob API

NextJob API is a RESTful backend service built with **Express.js** and **TypeScript**. It powers user authentication, profile management, and user administration for a job portal platform.

---

## Base URL

All endpoints are prefixed with:

```
/api/auth
```

---

## Authentication Endpoints

### `POST /register`

- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```
- **Response:** Returns the created user object along with a token.

### `POST /login`

- **Description:** Authenticate a user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:** Returns the authenticated user object along with a token.

### `POST /logout`

- **Description:** Log out the current user.
- **Response:** Returns a success message.

---

## User Self-Management (Protected)

All routes below require the `Authorization` header:

```
Authorization: Bearer <token>
```

### `GET /me`

- **Description:** Retrieve the profile of the logged-in user.

### `PUT /me`

- **Description:** Update the profile of the logged-in user.
- **Request Body (any subset):**
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com",
    "password": "newpassword"
  }
  ```

### `DELETE /me`

- **Description:** Delete the profile of the logged-in user.

### `GET /me/role`

- **Description:** Retrieve the role of the logged-in user.

### `PUT /me/role`

- **Description:** Update the role of the logged-in user.
- **Request Body:**
  ```json
  {
    "role": "admin"
  }
  ```

---

## Admin/User Management (Protected)

### `GET /`

- **Description:** Retrieve a list of all users.

### `GET /:id`

- **Description:** Retrieve a user by their ID.

### `PUT /:id`

- **Description:** Update a user by their ID.
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "password": "updatedpassword",
    "role": "admin"
  }
  ```

### `DELETE /:id`

- **Description:** Delete a user by their ID.

## Job Endpoints (Protected)

All routes below require the `Authorization` header:

```
Authorization: Bearer <token>
```

### `GET /api/jobs`

- **Description:** Retrieve all job listings.
- **Query Parameters (optional):** Filtering options such as `category`, `employmentType`, `workplaceType`, `skills`, etc.
- **Response:** Returns an array of job objects sorted by the latest.

### `GET /api/jobs/:id`

- **Description:** Retrieve a specific job post by its ID.
- **Response:** Returns the job object with populated employer information.

### `POST /api/jobs`

- **Description:** Create a new job post.
- **Request Body:**
  ```json
  {
    "title": "Frontend Developer",
    "description": "We are hiring...",
    "skills": ["React", "TypeScript", "CSS"],
    "category": "Software Development",
    "employmentType": "FULL_TIME",
    "workplaceType": "REMOTE",
    "salary": {
      "amount": 70000,
      "frequency": "YEARLY"
    },
    "company": {
      "name": "Tech Corp",
      "logo": "https://example.com/logo.png",
      "location": "Remote"
    }
  }
  ```
- **Response:** Returns the created job object.

### `PUT /api/jobs/:id`

- **Description:** Update an existing job post by ID. Only the original employer can update it.
- **Request Body:** Same structure as above (partial updates not yet supported).
- **Response:** Returns the updated job object.

### `DELETE /api/jobs/:id`

- **Description:** Delete a job post by ID. Only the original employer can delete it.
- **Response:** Returns a success message.

---

## Error Handling

Errors are handled globally by `errorMiddleware`. All error responses follow this structure:

```json
{
  "message": "Error message here."
}
```

---

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** for Authentication

---

## License

This project is licensed under the MIT License.

---

## Author

Made with ❤️ by **Gaurav Sahu**.
