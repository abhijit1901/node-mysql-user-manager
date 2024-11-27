/*
README: Bulk Insert of Random User Data into MySQL Using Node.js
This project outlines the step-by-step process to generate random user data using @faker-js/faker 
and insert it into a MySQL database using Node.js and the mysql2 library.
*/

const { faker } = require('@faker-js/faker'); // Library for generating random user data
const mysql = require('mysql2'); // Library for connecting to and querying MySQL
const express = require("express"); // Framework for building web applications
const app = express(); // Initializing the express application
const path = require("path"); // Core Node.js module for handling file paths
const methodOverride = require("method-override"); // Middleware for supporting HTTP verbs like PATCH and DELETE
const { v4: uuidv4 } = require('uuid'); // Import the v4 function for generating UUIDs

// Set up EJS view engine for rendering dynamic HTML templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // Define the folder where EJS templates are stored

// Middleware setup
app.use(methodOverride("_method")); // Enable HTTP verbs like PATCH and DELETE via query string
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.json()); // For parsing application/json

// Create a connection pool to MySQL database
const connection = mysql.createPool({
    host: 'localhost',          // Database host
    user: 'root',               // Database username
    database: 'delta_app',      // Database name
    password: '@Aj12345678910', // Database password
    waitForConnections: true,   // Queue requests when no connections are available
    connectionLimit: 10,        // Maximum number of concurrent connections
    queueLimit: 0,              // No limit for the request queue
});

// Function to generate a random user with faker
let getRandomUser = () => {
    return [
        faker.string.uuid(),        // Generates a unique user ID
        faker.internet.username(), // Generates a random username
        faker.internet.email(),    // Generates a random email address
        faker.internet.password(), // Generates a random password
    ];
};

// Route to display the home page, showing the count of users
app.get("/", (req, res) => {
    let q = "SELECT Count(*) AS count FROM user"; // SQL query to get the total number of users
    try {
        connection.query(q, (err, result) => {
            if (err) throw err; // Throw an error if the query fails
            let county = result[0].count; // Extract the count of users from the result
            console.log(result); // Log the result for debugging purposes
            res.render("home.ejs", { county }); // Render the homepage and pass the count variable
        });
    } catch (err) {
        console.log(err); // Log the error if something goes wrong
        res.send("Some error occurred in DB"); // Display an error message to the user
    }
});

// Route to display all users from the database
app.get("/user", (req, res) => {
    let q = "SELECT * FROM user"; // SQL query to get all users from the database
    try {
        connection.query(q, (err, users) => {
            if (err) throw err; // Throw an error if the query fails
            res.render("showusers.ejs", { users }); // Render the page to display all users
        });
    } catch (err) {
        console.log(err); // Log the error
        res.send("Some error occurred in DB"); // Display an error message to the user
    }
});

// Route to edit a user's details by their ID
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params; // Extract the user ID from the URL parameters
    let q = `SELECT * FROM user WHERE id = '${id}'`; // Query to get the user by their ID
    try {
        connection.query(q, (err, result) => {
            if (err) throw err; // Throw an error if the query fails
            console.log(result); // Log the query result for debugging
            let user = result[0]; // Extract the user object from the result
            res.render("edit.ejs", { user }); // Render the edit page with the user data
        });
    } catch (err) {
        console.log(err); // Log the error if something goes wrong
        res.send("Some error occurred in DB"); // Display an error message to the user
    }
});

// Route to update a user's username
app.patch("/user/:id", (req, res) => {
    let { id } = req.params; // Extract the user ID from the URL parameters
    let { password: formPassword, username: newUsername } = req.body; // Extract the submitted data (password and new username)
    let q = `SELECT * FROM user WHERE id = '${id}'`; // SQL query to get the user by ID
    try {
        connection.query(q, (err, result) => {
            if (err) throw err; // Throw an error if the query fails
            let user = result[0]; // Extract the user from the query result
            console.log(formPassword); // Log the submitted password for debugging purposes
            console.log(user.password); // Log the stored password for comparison

            // Check if the provided password matches the stored password
            if (formPassword != user.PASSWORD) { // Ensure the correct field name for password
                res.send("Wrong password"); // Inform the user if the password is incorrect
            } else {
                // SQL query to update the username of the user
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err; // Throw an error if the query fails
                    res.redirect("/user"); // Redirect to the page displaying all users
                });
            }
        });
    } catch (err) {
        console.log(err); // Log the error
        res.send("Some error occurred in DB"); // Display an error message to the user
    }
});

// Route to render the form for adding a new user, passing a randomly generated UUID
app.post("/user/new", (req, res) => {
    const randomId = uuidv4(); // Generate a unique ID for the new user
    res.render("newUser.ejs", { randomId }); // Pass the random ID to the view for rendering the form
});

// Route to handle the form submission for adding a new user
app.post("/user", (req, res) => {
    let { password: formPass, username: newUsername1, email: email1, id: newid } = req.body; // Extract form data
    let q3 = `INSERT INTO user (ID, USERNAME, EMAIL, PASSWORD) VALUES ('${newid}', '${newUsername1}', '${email1}', '${formPass}')`; // SQL query to insert the new user
    try {
        connection.query(q3, (err, result) => {
            if (err) throw err; // Throw an error if the query fails
            res.redirect("/user"); // Redirect to the page displaying all users
        });
    } catch (err) {
        console.log(err); // Log the error if something goes wrong
        res.send("Some error occurred in DB"); // Display an error message to the user
    }
});

app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("deleteUser.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });

app.delete("/user/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE ID='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        console.log(user.PASSWORD);
        console.log(password);
  
        if (user.PASSWORD != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE ID='${id}'`; //Query to Delete
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });

// Start the server and listen on port 8080
app.listen(8080, () => {
    console.log("Server is running on port 8080"); // Log a message when the server is running
});





/*
Key Points:
Route Structure: The routes are structured to handle:

Displaying user data (GET /user),
Viewing and editing a user's details (GET /user/:id/edit),
Updating a user's username (PATCH /user/:id),
Adding a new user (POST /user/new and POST /user).
Database Connection: The MySQL connection is managed using a connection pool, making it efficient to handle multiple database requests.

UUID: A randomly generated UUID is used for creating new users to ensure uniqueness.

Error Handling: Proper error handling is implemented throughout the code to ensure smooth operation and debugging.
*/










