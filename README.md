```markdown
# Bulk Insert of Random User Data into MySQL Using Node.js

This project demonstrates how to generate random user data and bulk insert it into a MySQL database using Node.js
 and the `@faker-js/faker` library. The application uses the `mysql2` library to interact with MySQL and `express`
to serve dynamic HTML pages using the EJS template engine.

## Features

- Generate random user data using the `@faker-js/faker` library.
- Insert new user data into a MySQL database.
- Display a list of users with their details.
- Edit user details such as username.
- Delete user after password confirmation.
- Easy-to-understand CRUD operations (Create, Read, Update, Delete).

## Use Cases

- **Admin Panel**: An administrator can view, add, update, or delete user data.
- **Random User Generation**: Ideal for generating fake user data for testing or bulk import into databases.
- **Database Management**: Manage user data with password protection for deletion and updates.

## Project Setup

### Prerequisites

1. **Node.js** installed on your system. You can download it from [here](https://nodejs.org/).
2. **MySQL** installed and running. You need to have a MySQL database created to hold user data.

### Setup Instructions

1. **Clone the Repository**

   Clone this project from GitHub:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install Dependencies**

   Install the necessary npm packages:

   ```bash
   npm install
   ```

3. **Set up MySQL Database**

   Make sure you have a MySQL database created and running. Use the following SQL schema to set up the `user` table:

   ```sql
   CREATE DATABASE delta_app;
   USE delta_app;

   CREATE TABLE user (
       ID VARCHAR(36) PRIMARY KEY,
       USERNAME VARCHAR(255) NOT NULL,
       EMAIL VARCHAR(255) NOT NULL,
       PASSWORD VARCHAR(255) NOT NULL
   );
   ```

4. **Configure Database Connection**

   Open `index.js` and replace the `mysql` connection configuration with your database credentials:

   ```javascript
   const connection = mysql.createPool({
       host: 'localhost',           // Database host
       user: 'root',                // Database username
       database: 'delta_app',       // Database name
       password: '<your_password>', // Database password
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0,
   });
   ```

5. **Run the Application**

   After the setup is complete, start the server by running:

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:8080`.

## Folder Structure

```
/project-directory
│
├── /node_modules             # npm packages
├── /views                    # EJS template files
│   ├── home.ejs              # Homepage for displaying user count
│   ├── showusers.ejs         # Displays all users in the database
│   ├── edit.ejs              # User edit page
│   ├── newUser.ejs           # Form to add a new user
│   └── deleteUser.ejs        # Page to confirm user deletion
├── /public                   # Static files (CSS, JS, images)
├── index.js                  # Main server file
├── package.json              # npm project configuration file
└── README.md                 # This README file
```

## Code Explanation

### 1. **Dependencies**

```javascript
const { faker } = require('@faker-js/faker'); // For generating random data
const mysql = require('mysql2'); // MySQL connection library
const express = require("express"); // Web framework for routing and middleware
const path = require("path"); // Node.js module for file path handling
const methodOverride = require("method-override"); // To support HTTP verbs like PATCH and DELETE
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for users
```

### 2. **Express Server Setup**

```javascript
const app = express(); // Create an Express application
app.set("view engine", "ejs"); // Use EJS for dynamic HTML rendering
app.set("views", path.join(__dirname, "/views")); // Set up views folder
app.use(methodOverride("_method")); // Enable HTTP verbs like DELETE via _method query
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(express.json()); // Middleware to parse JSON data
```

### 3. **MySQL Connection Setup**

```javascript
const connection = mysql.createPool({
    host: 'localhost',          // Host of the MySQL database
    user: 'root',               // Database user
    database: 'delta_app',      // Database name
    password: '@Aj12345678910', // Database password
    waitForConnections: true,   // Queue requests when no connection is available
    connectionLimit: 10,        // Maximum number of simultaneous connections
    queueLimit: 0               // No limit for the request queue
});
```

### 4. **Routes Overview**

#### 4.1 **Home Route**

```javascript
app.get("/", (req, res) => {
    let q = "SELECT Count(*) AS count FROM user"; // Get the count of users
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let county = result[0].count; // Get the number of users
            res.render("home.ejs", { county }); // Display the count on the home page
        });
    } catch (err) {
        res.send("Some error occurred in DB");
    }
});
```

#### 4.2 **List All Users**

```javascript
app.get("/user", (req, res) => {
    let q = "SELECT * FROM user"; // Get all users from the database
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showusers.ejs", { users }); // Render users to the template
        });
    } catch (err) {
        res.send("Some error occurred in DB");
    }
});
```

#### 4.3 **Edit User Details**

```javascript
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`; // Get user by ID
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]; // Extract the user details
            res.render("edit.ejs", { user }); // Render the edit page with user data
        });
    } catch (err) {
        res.send("Some error occurred in DB");
    }
});
```

#### 4.4 **Update User Details**

```javascript
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPassword, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`; // Get user by ID
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPassword != user.PASSWORD) { // Verify password
                res.send("Wrong password");
            } else {
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user"); // Redirect to user list
                });
            }
        });
    } catch (err) {
        res.send("Some error occurred in DB");
    }
});
```

### 5. **Server Start**

```javascript
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
```

## Conclusion

This project provides a full-stack solution to manage user data with the ability to generate random data and perform CRUD operations. The code is modular, easy to understand, and can be expanded further for more features like data validation, pagination, or user authentication.

For more information on how to extend this application, feel free to explore the Express, MySQL, and Faker.js documentation.
```
