// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');//Import JSON Web Token library
const { checkJWTToken, changePasswordVerification } = require('./middleware');//Custom middleware

// Hardcoded user information and todos 
let userInformation = {
  username: "admin@test.co.za",
  password: "p@ssw0rd1"
};

let todos = [
  {
    username: "admin@test.co.za",
    id: 1,
    title: "Implement post route for logging in.",
    completed: true,
  },
  {
    username: "admin@test.co.za",
    id: 2,
    title: "Implement custom middleware to authenticate user.",
    completed: true,
  },
];

// Route to get user information (dummy route)
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Route for user login
router.post('/login', function (req, res) {
  // Conditional rendering to check if the provided username and password match the hardcoded user information
  if (req.body.username == userInformation.username && req.body.password == userInformation.password) {
    // If the credentials are correct, create a JWT token
    let jwtToken = jwt.sign(
      {
        username: userInformation.username,
        password: userInformation.password,
      },
      "secretKey",
      { expiresIn: "1h" }
    );
    // Send the JWT token as a JSON response
    res.json({ token: jwtToken });
  } else {
    // If the credentials are incorrect, send a 401 Unauthorized response
    res.status(401).json({ message: "User not authenticated" });
  }
});

// Protected route using JWT token verification middleware
router.get('/', checkJWTToken, function (req, res) {
  // Send the todos as a JSON response if the JWT token is valid
  res.send(JSON.stringify(todos));
});

// Route to change user password with JWT token verification and custom middleware
router.put("/changePassword", checkJWTToken, changePasswordVerification, function (req, res) {
  // Update the hardcoded user password with the new password
  userInformation.password = req.newUserPassword;
  // Send a success message along with the updated password
  res.send({
    message: "Password Successfully changed",
    newPassword: userInformation.password
  });
});


module.exports = router;// Export the router for use in other parts of the application
