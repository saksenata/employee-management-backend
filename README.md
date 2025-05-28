# Employee Management System - Backend

This is the backend API for the Employee Management System, built with Express.js, Sequelize, and PostgreSQL.

## Features

-   CRUD operations for employees.
-   File uploads for employee photos.
-   Data validation using Yup.
-   Dummy authentication.
-   Structured error handling.
-   Clean architecture (Repositories, Services, Controllers).

## Prerequisites

-   Node.js (v14 or later recommended)
-   npm or yarn
-   PostgreSQL server running

## Setup

1.  **Clone the repository (or ensure you are in the `employee-management-backend` directory).**

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the `employee-management-backend` directory and populate it with your configuration. A sample `.env.example` or the following structure can be used:

    ```env
    DB_USER=your_postgres_user
    DB_HOST=localhost
    DB_NAME=employee_management
    DB_PASSWORD=your_postgres_password
    DB_PORT=5432

    PORT=5000
    NODE_ENV=development # or production

    JWT_SECRET=your_very_strong_jwt_secret # Used if JWT auth is fully implemented
    # For Dummy Auth (as currently implemented):
    # No specific env vars needed for the dummy auth itself, but ensure client sends correct headers.
    ```
    **Important:**
    *   Replace `your_postgres_user`, `your_postgres_password` with your actual PostgreSQL credentials.
    *   Ensure the database `employee_management` (or your chosen `DB_NAME`) exists in your PostgreSQL server. If not, create it.
    *   The `PORT` (e.g., 5000) is where the backend server will run.
    *   `NODE_ENV` can be `development` or `production`. In development, more detailed logs and error messages might be shown.

4.  **Database Synchronization:**
    The application uses Sequelize to manage the database schema. When the server starts in `development` mode, it will attempt to synchronize the models with the database using `sequelize.sync({ alter: true })`. This will create tables if they don't exist and attempt to alter them to match the models.
    For production, it's highly recommended to use migrations.

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command uses `nodemon` to automatically restart the server when file changes are detected. The server will typically run on `http://localhost:5000` (or the `PORT` specified in your `.env` file).

2.  **Start the server (production mode):**
    ```bash
    npm start
    ```
    Ensure `NODE_ENV` is set to `production` in your `.env` file for production deployments.

## API Endpoints

All endpoints are prefixed with `/api/employees`.

*   **`POST /`**: Create a new employee.
    *   Requires dummy authentication header: `X-Dummy-Auth: allowed`
    *   Expects `multipart/form-data` due to potential file upload.
    *   **Body**: JSON fields matching the `Employee` model (e.g., `fullName`, `nik`, `email`, `password`, `photo` (file)).
    *   Validation: `createEmployeeSchema`.
*   **`GET /`**: Get all employees.
    *   Requires dummy authentication header: `X-Dummy-Auth: allowed`
    *   Supports query parameters:
        *   `page` (number, default: 1)
        *   `limit` (number, default: 10)
        *   `status` (string, e.g., 'AKTIF', 'NON-AKTIF')
        *   `search` (string, searches across multiple fields)
*   **`GET /:id`**: Get a single employee by ID.
    *   Requires dummy authentication header: `X-Dummy-Auth: allowed`
*   **`PUT /:id`**: Update an employee by ID.
    *   Requires dummy authentication header: `X-Dummy-Auth: allowed`
    *   Expects `multipart/form-data` if `photo` is being updated.
    *   **Body**: JSON fields to update.
    *   Validation: `updateEmployeeSchema`.
*   **`DELETE /:id`**: Delete an employee by ID.
    *   Requires dummy authentication header: `X-Dummy-Auth: allowed`

### Dummy Authentication

To access protected routes, include the following header in your requests:
`X-Dummy-Auth: allowed`

### File Uploads

When creating or updating an employee with a photo, use the `photo` field in your `multipart/form-data` request.
Uploaded photos are stored in the `uploads/photos/` directory on the server and served statically via `/uploads/photos/`. The `photoPath` field in the employee data will store the relative path (e.g., `photos/employee-timestamp-random.jpg`).

## Project Structure

```
employee-management-backend/
├── src/
│   ├── app.js                  # Express application setup
│   ├── server.js               # Server startup script
│   ├── config/
│   │   └── database.js         # Sequelize database configuration
│   ├── controllers/
│   │   └── employeeController.js # Request handlers
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── upload.js           # Multer file upload middleware
│   ├── models/
│   │   └── Employee.js         # Sequelize Employee model
│   ├── repositories/
│   │   └── employeeRepository.js # Data access layer
│   ├── routes/
│   │   └── employeeRoutes.js   # API routes
│   ├── services/
│   │   └── employeeService.js  # Business logic layer
│   └── utils/
│       └── validation.js       # Yup validation schemas
├── uploads/                    # Directory for uploaded files (created automatically)
│   └── photos/
├── .env                        # Environment variables (create this file)
├── package.json
├── package-lock.json
└── README.md
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.