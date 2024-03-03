# MIDDLEWARE

### Import jsonwebtoken libray
```
const jwt = require('jsonwebtoken'); // Import the 'jsonwebtoken' library for handling JSON Web Tokens
```

### authenticationToken
```javascript
// Middleware function for authentication token
const authenticationToken = (req, res, next) => {
    // Extract the authorization header from the request
    const authHeader = req.headers.authorization;
    // Extract the token from the authorization header
    const token = authHeader && authHeader.split(' ')[1];

    // Conditional rendering to check if token is missing
    if (!token) {
        // If token is missing, send 401 Unauthorized response with a message
        return res.status(401).json({ message: 'Token missing in request header' });
    }

    // Verify the token using the 'secretKey'
    jwt.verify(token, 'secretKey', (err, decoded) => {
        // If there's an error in verification
        if (err) {
            // Send 401 Unauthorized response with a message
            return res.status(401).json({ message: 'Invalid token or expired token' });
        }
        // If token is valid, attach the decoded payload to the request object
        req.decoded = decoded;
        // Call the next middleware function
        next();
    });
};
```

This middleware function checks if a JWT (JSON Web Token) is present in the request headers. 
It expects the token to be provided in the `Authorization` header in the format `Bearer <token>`. 
If the token is missing, it sends a 401 Unauthorized response with a message indicating that the 
token is missing in the request header. If the token is present, it verifies the token using the 
'secretKey'. If the token is invalid or expired, it sends a 401 Unauthorized response with a message 
indicating that the token is invalid or expired. If the token is valid, it attaches the decoded 
payload to the `req` object and calls the next middleware function in the chain.

### checkJwtToken

```javascript

// Middleware function for checking JWT token
const checkJwtToken = (req, res, next) => {
    // Check if the token is present in the request headers
    if (req.headers.token) {
        // Extract the token from the request headers
        let token = req.headers.token;
        // Verify the token using the 'secretKey'
        jwt.verify(token, 'secretKey', function(error, data) {
            // If there's an error in verification
            if (error) {
                // Send response indicating invalid token
                res.send({ message: 'Invalid Token' });
                console.error('Invalid Token');
                return res.status(401).json({ message: 'Invalid Token' });
            } else {
                // If token is valid, attach username and password from token data to request object
                req.username = data.username;
                req.password = data.password;
                // Call the next middleware function
                next();
            }
        });
    } else {
        // If no token is attached to the request headers, send response indicating the same
        res.send({ message: 'No token attached to the request' });
        return res.status(401).json({ message: 'No Token Attached to the Request' });
    }
};

```

This middleware function checks if a JWT token is present in the request headers. If a token is found, it verifies the 
token using the 'secretKey'. If the token is valid, it attaches the username and password from the token data to the `req` 
object and calls the next middleware function in the chain. If the token is invalid or missing, it sends an appropriate 
response indicating the issue.

### validateUsername
```javascript
// Middleware function for validating username
const validateUsername = (req, res, next) => {
    // Extract the newUsername from the request body
    const { newUsername } = req.body;
    // Log the newUsername to the console for debugging purposes
    console.log(newUsername);

    // Check if newUsername is missing or does not end with '@gmail.com'
    if (!newUsername || !newUsername.endsWith('@gmail.com')) {
        // If newUsername is invalid, send a 403 Forbidden response with a message
        return res.status(403).json({ message: 'Access Forbidden: Invalid Username' });
    }

    // If newUsername is valid, call the next middleware function
    next();
};
```

Explanation:
- This middleware function extracts the `newUsername` from the request body.
- It then logs the `newUsername` to the console, which can be helpful for debugging purposes.
- Next, it checks if `newUsername` is either missing or doesn't end with '@gmail.com'.
- If `newUsername` is missing or invalid, it sends a 403 Forbidden response with a message indicating that the username is invalid.
- If `newUsername` is valid, it calls the next middleware function in the chain.

### limitTaskLength

```javascript
// Middleware function for limiting task length
const limitTaskLength = (req, res, next) => {
    // Extract the newTask from the request body
    const { newTask } = req.body;
    // Define the maximum length allowed for the task title
    const maxLength = 140;

    // Check if newTask is provided and its length exceeds the maximum length
    if (newTask && newTask.length > maxLength) {
        // If newTask exceeds the maximum length, send a 400 Bad Request response with a message
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    // If newTask is within the allowed length, call the next middleware function
    next();
};

module.exports = limitTaskLength; // Export the middleware function
```

Explanation:
- This middleware function extracts the `newTask` from the request body.
- It defines the `maxLength` variable to specify the maximum allowed length for the task title (which is set to 140 characters in this case).
- Next, it checks if `newTask` is provided (`newTask` is truthy) and whether its length exceeds the `maxLength`.
- If the length of `newTask` exceeds `maxLength`, it sends a 400 Bad Request response with a message indicating that the task title exceeds the maximum length.
- If the length of `newTask` is within the allowed limit, it calls the next middleware function in the chain.

### enforceContentType

```javascript
// Middleware function for enforcing content type
const enforceContentType = (req, res, next) => {
    // Extract the content type from the request headers
    const contentType = req.headers['content-type'];

    // Check if the content type is missing or not 'application/json'
    if (!contentType || contentType !== 'application/json') {
        // If content type is missing or not 'application/json', send a 415 Unsupported Media Type response
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    // If content type is 'application/json', call the next middleware function
    next();
};

```

Explanation:
- This middleware function extracts the `contentType` from the request headers.
- It then checks if the `contentType` is missing or not equal to `'application/json'`.
- If the content type is missing or not `'application/json'`, it sends a 415 Unsupported Media Type response with
  a message indicating that the Content-Type must be `application/json`.
- If the content type is `'application/json'`, it calls the next middleware function in the chain.

  ### Export middleware

```
module.exports ={authenticationToken, checkJwtToken, validateUsername, limitTaskLength ,enforceContentType }
```
