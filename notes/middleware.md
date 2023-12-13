# TASK MIDDLEWARE EXAMPLES 
## AUTHENTICATION
```
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token,
    process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

```
## VALID USERNAME
Express middleware that responds with an `HTTP 403 (forbidden) status code` to all requests from users whose usernames don't end with the substring '@gmail.com':

```javascript
// Import necessary modules
const jwt = require('jsonwebtokens');

// Custom middleware function
const validateUsername = (req, res, next) => {
  // Extract 'username' in the request body or query parameters
  const username = req.body.username || req.query.username;

  // Check if the username ends with '@gmail.com'
  if (username && username.endsWith('@gmail.com')) {
    // If the username is valid, proceed to the next middleware or route handler
    next();
  } else {
    // If the username is not valid, respond with HTTP 403 Forbidden status
    res.status(403).send('Access Forbidden: Invalid username');
  }
};


```

- The `validateUsername` middleware checks if the provided username (from request body or query parameters) ends with '@gmail.com'.
- If it does, the middleware calls `next()` to proceed to the next middleware or route handler. If not, it responds with a `403 Forbidden` status and a corresponding message.
- This middleware is then applied to all routes using `app.use(validateUsername)`.

## VALID TASKS

## VALID CONTENT TYPES
