# TASK MIDDLEWARE EXAMPLES 
## AUTHENTICATION

**Middleware function to authenticate a JWT token from the 'Authorization' header**
```
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Extract the token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is found, send a 401 Unauthorized response
    if (token == null) return res.sendStatus(401);

    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            // If there's an error during token verification, send a 403 Forbidden response
            return res.sendStatus(403);
        }

        // If the token is valid, attach the decoded user data to the request object and proceed to the next middleware
        req.decoded = decoded; 
        next();
    });
}

```
## VALID USERNAME
**Express middleware that responds with an `HTTP 403 (forbidden) status code` to all requests from users whose usernames don't end with the substring '@gmail.com':**

```javascript
const jwt = require('jsonwebtokens');

// Custom middleware function
const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;    // Extract 'username' in the request body or query parameters

    // Conditional rendering to check if the username ends with '@gmail.com'
    if (username && username.endsWith('@gmail.com')) {
        
        next();// If the username is valid, proceed to the next middleware or route handler
    } else {
        // If the username is not valid, respond with HTTP 403 Forbidden status
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};


```

- The `validateUsername` middleware checks if the provided username (from request body or query parameters) ends with '@gmail.com'.
- If it does, the middleware calls `next()` to proceed to the next middleware or route handler. If not, it responds with a `403 Forbidden` status and a corresponding message.
- This middleware is then applied to all routes using `app.use(validateUsername)`.

## VALID TASK LENGTH
**Middleware function to limit the length of a task title**
```
function limitTaskLength(req, res, next) {
    const { newTask } = req.body;
    const maxLength = 140;

    // Conditional rendering to check if the task title exceeds the maximum length
    if (newTask && newTask.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    // If the task title length is within the limit, proceed to the next middleware/route
    next();
}
```
## VALID CONTENT TYPES

**Middleware function to enforce the 'Content-Type' header to be 'application/json'**

```
function enforceContentType(req, res, next) {
    const contentType = req.headers['content-type'];

    // Conditional rendering to check if no 'Content-Type' header is found or it's not 'application/json', send a 415 Unsupported Media Type status
    if (!contentType || contentType.indexOf('application/json') !== 0) {
        // If content type is not JSON, send a 415 Unsupported Media Type status
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    // If the 'Content-Type' is valid, proceed to the next middleware/route
    next();
}

```
