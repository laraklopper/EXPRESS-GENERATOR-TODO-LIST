const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


// Middleware function to authenticate a JWT token from the 'Authorization' header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;     // Extract the 'Authorization' header from the request
    const token = authHeader && authHeader.split(' ')[1];     // Extract the token from the 'Authorization' header

    // Conditional rendering to check if the token is missing
    if (!token) return res.status(401).json({ message: 'Token missing in the request header' });// If no token is found, send a 401 Unauthorized response
    

    // Verify the token using the provided 'secretKey'
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        // Attach the decoded information to the request object for later use
        req.decoded = decoded;
        next();// Move to the next middleware or route handler
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
}
// Middleware function for user authentication
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];// Extract the token from the Authorization header in the request

        req.body.username = jwt.verify(token, tokenSecret);// Verify the token using the jwt.verify method, and decode the username from it

        next();        // Call the next middleware function or route handler in the chain

    } catch (error) {
        // If an error occurs during token verification, send a 401 Unauthorized response
        res.status(401).json({ message: 'Auth failed' });
    }
}

// Middleware function to validate the format of a username 
const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;    // Extract 'username' in the request body or query parameters
    console.log(username);//Log the username in the console

    // Conditional rendering to check if the username ends with '@gmail.com'
    if (username && username.endsWith('@gmail.com')) {

        next();// If the username is valid, proceed to the next middleware or route handler
    } else {
        // If the username is not valid, respond with HTTP 403 Forbidden status
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};


// Middleware function to limit the length of a task title
const limitTaskLength =(req, res, next) => {
    const { newTask } = req.body;// Extract the new task title from the request body
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
    //Middleware function to limit the length of an updated task
    const limitUpdatedTaskLength = (req, res, next) => {
        const { title } = req.body; // Extract the title from the request body
        const maxLength = 140;//Max length

        // Conditional rendering to check if the task title exceeds the maximum length
        if (title && title.length > maxLength) {
            return res.status(400).json({
                message: `Task title exceeds the maximum length of ${maxLength} characters.`,
            });
        }
        // If the task title length is within the limit, proceed to the next middleware/route
        next();
    }

// Middleware function to enforce the 'Content-Type' header to be 'application/json'
const enforceContentType= (req, res, next) => {
    const contentType = req.headers['content-type'];    // Extract the 'Content-Type' header from the request

    // Conditional rendering if 'Content-Type' is present and set to 'application/json'
    if (!contentType || contentType.indexOf('application/json') !== 0) {
        // If not, return a 415 Unsupported Media Type response
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

  
    next();// If 'Content-Type' is valid, move to the next middleware or route handler
}



// Export the middleware functions for use in other parts of the application
module.exports = {
    authenticateToken,// Middleware function to authenticate a JWT token from the 'Authorization' header
    checkJwtToken,// Middleware function to check and verify a JWT token from the 'token' header
    validateUsername,// Middleware function to validate the format of a username
    authenticateUser,// Middleware function for user authentication
    limitTaskLength,// Middleware function to limit the length of a task title
    limitUpdatedTaskLength,//Middleware function to limit the length of an updated task
    enforceContentType,// Middleware function to enforce the 'Content-Type' header to be 'application/json'   
}

