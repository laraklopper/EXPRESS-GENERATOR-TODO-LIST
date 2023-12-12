const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


// Middleware function to check if a JWT token is present in the request headers
function checkJWTToken(req, res, next) {
    // Conditional rendering to check if the 'Authorization' header is present in the request
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization,// Verify the JWT token using the 'verify' method from the 'JWT' library
             "secretKey", //secret key
             function (error, data) {
                 if (error) {// Check if an error occured during token verification
                     // If there's an error during token verification, send a 403 (Forbidden) response
                return res.status(401).send({ message: "Invalid Token" });
            } 
            else {
                // If the token is valid, attach the decoded data to the request object and proceed to the next middleware
                req.username = data.username;
                req.password = data.password;
                next();
            }
        });
    } else {
        // If no 'Authorization' header is found, send a 400 (Bad Request) response
        res.status(400).send({ message: "No token attached to the request" });
    }
}

// Middleware function to authenticate a JWT token from the 'Authorization' header
function authenticateToken(req, res, next) {
    // Extracting the token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is found, send a 401 Unauthorized response
    if (token == null) return res.sendStatus(401);

    // Verifying the JWT token using the 'verify' method
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

// Middleware function to limit the length of a task title
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
    checkJWTToken,
    authenticateToken,
    limitTaskLength,
    enforceContentType
};
