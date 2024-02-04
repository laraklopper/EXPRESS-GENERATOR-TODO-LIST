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
            // return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // If verification succeeds, store the decoded user information in the request object
        req.decoded = decoded;
        next();// Move to the next middleware in the chain
    });
}
// Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    // Conditional rendering to check if the 'token' header is present in the request
    if (req.headers.token) {
        let token = req.headers.token;// Extract the token from the 'token' header
        // Verify the token using the provided 'secretKey'
        jwt.verify(token, "secretKey", function (error, user) {
            if (error) {
                //Error handling if there's an error during verification
                console.error('JWT Verification Error:', error);// Log a the JWT verification error in the console for debugging purposes
               
                res.send({ message: 'Invalid Token' });// Send a response indicating that the token is invalid
                next();// Move to the next middleware or route handler

            } 
            else {
                req.user = user;// If the token is valid, attach user information to the request object for later use

                next();// Move to the next middleware or route handler
            }
        })
    } else {
        // If no 'token' header is attached, return a 401 Unauthorized response
        res.status(401).json({ message: 'No token attached to the request' });
    }
//Middleware function to check if the provided username is valid
function validateUsername = (req, res, next) => {
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
// const validateUsername = (req, res, next) => {
//     // Extract the newUsername from the request body
//     const username = req.body.newUsername;

//     // Regular expression to check if the username follows a basic email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     // Conditional rendering to check if the username is provided and matches the email format
//     if (username && emailRegex.test(username) && username.endsWith('@gmail.com')) {
//         // If the username is valid, proceed to the next middleware
//         next();
//     } else {
//         /* If the username is missing or does not match the format, respond with a 403 Forbidden status
//          and a JSON object containing an error message*/
//         res.status(403).json({ message: 'Access Forbidden: Invalid email format' });
//     }
// };

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
    authenticateToken,// Middleware function to authenticate a JWT token from the 'Authorization' header
    checkJwtToken,// Middleware function to check and verify a JWT token from the 'token' header
    validateUsername,// Middleware function to validate the format of a username
    limitTaskLength,// Middleware function to limit the length of a task title
    enforceContentType,// Middleware function to enforce the 'Content-Type' header to be 'application/json'   
}}


