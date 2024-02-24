const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    //Conditional rendering to check if the 'token' header exists
    if (req.headers.token) {
        let token = req.headers.token;// Get token value from request header
        // Verify the token using the 'jwt.verify' method
        jwt.verify(token, 'secretKey', function(error, data){
            //Conditional rendering to check if an error is present
            if (error) {
                 /*Return a JSON response with a status code of 401 (Unauthorized)
                and a message indicating that the token provided in the request is invalid*/
                res.send({message: 'Invalid Token'})
                console.error('Invalid Token');//Log an error message in the console for debugging purposes
                return res.status(401).json({ message: 'Invalid Token' })
            } else {
                // If token is valid, extract username and password from decoded token payload
                req.username = data.username;
                req.password = data.password;
                next()// Call the next middleware or route handler

            }
        })
    } else {
        res.send({ message: 'No token attatched to the request' }) // If 'token' header is missing, send response indicating no token attached
        /*Return a JSON response with a status code of 401 (Unauthorized)
                and a message indicating that the token provided in the request*/
        return res.status(401).json({ message: 'No Token Attached to the Request' });
    }
};

//Middleware function to check if the provided username is valid
const validateUsername = (req, res, next) => {
    const { newUsername } = req.body;// Extract new username from request body
    console.log(newUsername);// Log the new username for debugging purposes

    // Conditional rendering to check if the username is missing or does not end with '@gmail.com'
    if (!newUsername || !newUsername.endsWith('@gmail.com')) {
        // If the username is invalid, send a 403 Forbidden response with an error message
        return res.status(403).json({ message: 'Access Forbidden: Invalid Username' });
    }

    next()// Call the next middleware or route handler
};


//Middleware function to limit the length of the task title
const limitTaskLength = (req, res, next) => {
    const { newTask } = req.body;//Extract the new task title from the request body
    const maxLength = 140;//Define the maximum length allowed for task titles

    // Conditional rendering to check if the new task title exists and its length exceeds the maximum length
    if (newTask && newTask.length > maxLength) {
        // If the title length exceeds the limit, send a 400 Bad Request response with an error message
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    next();// Call the next middleware or route handler
}

//Middleware to enforce the content-type header to be application/json
const enforceContentType = (req, res, next) => {
    const contentType = req.headers['Content-Type'];// Get the value of 'Content-Type' header

    // Conditional rendering to check if 'Content-Type' header is missing or not 'application/json'
    if (!contentType || !contentType.includes('application/json')) {
        // If 'Content-Type' is missing or not 'application/json', send a 415 Unsupported Media Type response
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    next();// Call the next middleware or route handler
};

// Export the middleware functions for use in other parts of the application
module.exports = {
    checkJwtToken,
    validateUsername,
    limitTaskLength,
    enforceContentType,
}
