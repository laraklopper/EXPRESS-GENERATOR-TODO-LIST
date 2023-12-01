```
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkJWTToken } = require('./middleware');

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

router.post('/login', function (req, res) {
  if (req.body.username == userInformation.username && req.body.password == userInformation.password) {
    let jwtToken = jwt.sign(
      {
        username: userInformation.username,
        password: userInformation.password,
      },
      "secretKey",
      { expiresIn: "1h" }
    );
    res.json({ token: jwtToken }); // Send a JSON object
  } else {
    res.status(401).json({ message: "User not authenticated" }); // Send a JSON object with status 401
  }
});

router.get('/', function (req, res) {
  res.send('respond with a resource');
});

router.get('/todos', checkJWTToken, function (req, res) {
  res.json(todos); // Send JSON response
});

module.exports = router;
```
