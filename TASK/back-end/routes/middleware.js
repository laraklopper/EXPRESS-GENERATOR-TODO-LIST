const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


// Middleware function to authenticate a JWT token from the 'Authorization' header
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];// Extract the token from the 'Authorization' header
    const token =  authHeader.split(' ')[1];// Extract the token from the header
  
    //Conditional rendering to check if the token is missing
    if (token == null) return res.sendStatus(401);// If no token is found, send a 401 Unauthorized response


    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            // If there's an error during token verification, send a 403 Forbidden response
            return res.sendStatus(403);
        }

        // If verification succeeds, store the decoded user information in the request object
        req.decoded = decoded;
        next();// Move to the next middleware in the chain
    });
}

//Middleware function to check if the provided username is valid
const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;    // Extract 'username' in the request body or query parameters
    console.log(username);

    // Conditional rendering to check if the username ends with '@gmail.com'
    if (username && username.endsWith('@gmail.com')) {

        next();// If the username is valid, proceed to the next middleware or route handler
    } else {
        // If the username is not valid, respond with HTTP 403 Forbidden status
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};

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



// Export the middleware functions for use in other parts of the application
module.exports = {
    authenticateToken,//// Middleware function to authenticate a JWT token from the 'Authorization' header
    limitTaskLength,// Middleware function to limit the length of a task title
    enforceContentType,// Middleware function to enforce the 'Content-Type' header to be 'application/json'
    validateUsername,//Middleware function to check if the provided username is valid
};
