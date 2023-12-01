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
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router;


```
