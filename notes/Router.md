# EXPRESS.ROUTER

Express route that handles user login and generates a JWT:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

 
  if (username === 'user@gmail.com' && password === 'password') {
    // Generate a JWT token
    const token = jwt.sign({ username: username }, 'TOP_SECRET', { expiresIn: '1h' });

    
    res.json({ token });// Send the token in the response
  } else {
    // Invalid credentials
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
```

- The route `/login` expects a POST request with a JSON payload containing `email` and `password`.
- It checks if the provided credentials match a hardcoded user (in a real application, you would typically check against a database).
- If the credentials are valid, it generates a JWT using `jwt.sign` with the user's email and a secret key. The `expiresIn` option sets the expiration time for the token.
- The generated token is then sent back in the JSON response.

`````
// Import the express module and create a router instance
const express = require('express');
const router = express.Router();

// Define a GET route for '/profile'
router.get(
  '/profile',
  // Middleware function - This function will be executed before the final route handler
  (req, res, next) => {
    // Respond with JSON containing a message, user information from the request object, and a token from the query parameters
    res.json({
      message: 'You made it to the secure route', // Success message
      user: req.user, // User information retrieved from the request object
      token: req.query.secret_token // Token retrieved from the query parameters
    });
  }
);

module.exports = router; // Export the router to be used in other parts of the application


```
