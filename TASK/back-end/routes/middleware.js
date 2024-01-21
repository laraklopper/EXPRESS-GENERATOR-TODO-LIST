const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


// Middleware function to authenticate a JWT token from the 'Authorization' header
function authenticateToken(req, res, next) {
    // Extract the token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    /* Conditional rendering to check if authHeader exists and is truthy using the logical AND operator (&&).
 If authHeader is falsy (e.g., null or undefined), token will be assigned the value of authHeader (null or undefined).
 If authHeader is truthy, the expression after && is evaluated.*/
    if (token == null) return res.sendStatus(401);// If no token is found, send a 401 Unauthorized response
    /*A 401(Unauthorized) response status code indicates that the client request has not been completed because it lacks 
    valid authentication credentials for the requested resource.*/


    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            // If there's an error during token verification, send a 403 Forbidden response
            return res.sendStatus(403);
            // A 403(Forbidden) response status code indicates that the server understands the request but refuses to authorize it.
        }

        // If the token is valid, the decoded information is attached to the request for further use.the decoded user data to the request object 
        req.decoded = decoded; 
        next();//The middleware then calls the `next()` function to move to the next middleware in the stack.
    });
}

// Middleware function to limit the length of a task title
function limitTaskLength(req, res, next) {
    const { newTask } = req.body;
    const maxLength = 140;//Max length

    // Conditional rendering to check if the task title exceeds the maximum length
    if (newTask && newTask.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    // If the task title length is within the limit, proceed to the next middleware/route
    next();
}

// Middleware function to enforce the 'Content-Type' header to be 'application/json'
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

//Middleware function to check if the provided username is valid
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

// Export the middleware functions for use in other parts of the application
module.exports = {
    authenticateToken,//// Middleware function to authenticate a JWT token from the 'Authorization' header
    limitTaskLength,// Middleware function to limit the length of a task title
    enforceContentType,// Middleware function to enforce the 'Content-Type' header to be 'application/json'
    validateUsername
};
