# NextJob API

NextJob API is a RESTful backend service built with **Express.js** and **TypeScript**. It provides user authentication, profile management, and user administration functionalities for a job portal platform.

---

## Base URL

All endpoints are prefixed with:

```
/api/auth
```

---

## Authentication Routes

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
- **Response:** Created user object with a token.

### `POST /login`
- **Description:** Log in a user.
- **Request Body:**
    ```json
    {
        "email": "john@example.com",
        "password": "securepassword"
    }
    ```
- **Response:** Authenticated user object with a token.

### `POST /logout`
- **Description:** Log out the current user.
- **Response:** Success message.

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

---

## Email-based User Management (Protected)

### `GET /email/:email`
- **Description:** Retrieve a user by their email address.

### `PUT /email/:email`
- **Description:** Update a user by their email address.
- **Request Body:**
    ```json
    {
        "name": "New Name",
        "email": "newemail@example.com",
        "password": "newpassword",
        "role": "user"
    }
    ```

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
