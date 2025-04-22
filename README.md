# Employee Management App

## Description

This application provides a system for managing employees, allowing users to register, log in, and manage employee information.  It includes features for adding, updating, and assigning roles to employees.

## Features and Functionality

*   **User Authentication:**
    *   Registration with email verification using OTP (One-Time Password).
    *   Login and Logout functionality.
    *   Session-based authentication.
    *   User profile updates.
*   **Employee Management:**
    *   Add new employees.
    *   Update existing employee information.
    *   Assign roles to employees (Admin only).
*   **Authorization:**
    *   Protected routes requiring user authentication.
    *   Admin role-based access control for specific functionalities.
*   **Dashboard:**
    *   Displays user information and associated employee data.
*   **Email Notifications:**
    *   Sends OTP for email verification during registration and resend OTP.
*   **Validation:**
    * Implemented signup, login, and employee addition validation using express-validator.

## Technology Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose
*   **Authentication:** express-session, bcrypt
*   **Email:** Nodemailer
*   **Validation:** express-validator
*   **Other:** dotenv, date-fns, cors, connect-mongo
*   **Bootstrap:** Used Bootstrap for email templates.

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   Node.js (v14 or higher)
*   MongoDB installed and running
*   Nodemailer configured with a Gmail account (or other email service)
*   Environment variables properly set up

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/RUYANGA/Employee-Management-App.git
    cd Employee-Management-App
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```
    PORT=5000
    DB_URL=<Your MongoDB Connection String>
    SECRET_SESSION=<Your Secret Session Key>
    EMAIL=<Your Gmail Address>
    EMAIL_PASS=<Your App Password or Gmail Password>
    ```

    **Note:**
    *   Replace `<Your MongoDB Connection String>` with your actual MongoDB connection string.
    *   Replace `<Your Secret Session Key>` with a strong, randomly generated secret key.
    *   Replace `<Your Gmail Address>` with your Gmail address.
    *   Replace `<Your App Password or Gmail Password>` with your Gmail app password (recommended) or Gmail password. For Gmail, it is highly recommended to use an app password instead of your regular password for security reasons.  You can generate an app password in your Google account settings under Security.

4.  **Run the application:**

    ```bash
    npm start
    ```

    The server will start running on `http://localhost:5000` (or the port specified in your `.env` file).

## Usage Guide

### User Registration

1.  Send a POST request to `/api/user/signup` with the following JSON payload:

    ```json
    {
        "Fname": "John",
        "Lname": "Doe",
        "email": "john.doe@example.com",
        "password": "StrongPassword123!"
    }
    ```

    *   Ensure the password meets the strong password requirements specified by `express-validator` (at least 6 characters, including characters, numbers, and symbols).

2.  Upon successful registration, an OTP will be sent to the provided email address.

### Email Verification

1.  Send a POST request to `/api/user/verify` with the following JSON payload:

    ```json
    {
        "email": "john.doe@example.com",
        "Otp": "123456"
    }
    ```

    *   Replace `"123456"` with the OTP received in the email.

### Resend OTP

1.  Send a POST request to `/api/user/resendOtp` with the following JSON payload:

    ```json
    {
        "email": "john.doe@example.com"
    }
    ```

### User Login

1.  Send a POST request to `/api/user/login` with the following JSON payload:

    ```json
    {
        "email": "john.doe@example.com",
        "password": "StrongPassword123!"
    }
    ```

### User Logout

1.  Send a POST request to `/api/user/lognout`.  This requires authentication.

### Accessing the Dashboard

1.  After logging in, send a POST request to `/api/user/dashboard`. This requires authentication.

### Updating User Information

1.  After logging in, send a PUT request to `/api/user/update` with the following JSON payload:

    ```json
    {
        "Fname": "Jane",
        "Lname": "Doe",
        "email": "jane.doe@example.com",
        "password": "NewStrongPassword123!"
    }
    ```

    Note: The `password` field is optional. If provided, it will be hashed and updated.

### Adding an Employee

1.  After logging in, send a POST request to `/api/employee/add` with the following JSON payload:

    ```json
    {
        "Fname": "Alice",
        "Lname": "Smith",
        "email": "alice.smith@example.com",
        "phone": "+250788123456",
        "role": "developer"
    }
    ```
    Note: Phone number must start with +250 and followed by 9 digits.

### Updating Employee Information

1.  After logging in, send a PUT request to `/api/employee/update/:id` (replace `:id` with the employee's ID) with the following JSON payload:

    ```json
    {
        "Fname": "UpdatedFirstName",
        "Lname": "UpdatedLastName",
        "email": "updated.email@example.com",
        "phone": "+250788654321"
    }
    ```

### Updating Employee Role (Admin Only)

1.  After logging in as an admin, send a PUT request to `/api/employee/updaterole/:id` (replace `:id` with the employee's ID) with the following JSON payload:

    ```json
    {
        "role": "manager"
    }
    ```

## API Documentation

### Authentication Endpoints

*   `POST /api/user/signup`: Registers a new user.
*   `POST /api/user/verify`: Verifies the user's email using OTP.
*   `POST /api/user/resendOtp`: Resends the OTP to the user's email.
*   `POST /api/user/login`: Logs in an existing user.
*   `POST /api/user/lognout`: Logs out the current user.
*   `POST /api/user/dashboard`: Returns user dashboard information (requires authentication).
*   `PUT /api/user/update`: Updates user information (requires authentication).

### Employee Endpoints

*   `POST /api/employee/add`: Adds a new employee (requires authentication).
*   `PUT /api/employee/update/:id`: Updates an existing employee's information (requires authentication).
*   `PUT /api/employee/updaterole/:id`: Updates an existing employee's role (requires authentication, admin only).

## Contributing Guidelines

Contributions are welcome! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License Information

No license specified. All rights reserved.

## Contact/Support Information

For any questions or support, please contact Merci RUYANGA at [https://github.com/RUYANGA](https://github.com/RUYANGA).