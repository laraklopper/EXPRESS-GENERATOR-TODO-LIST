// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');

// Middleware function to authenticate requests using JWT token
const authenticationToken = (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            message: 'Token missing in request header' 
        });
    }
    // Verify the token
    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {           
            return res.status(401).json({ 
                message: 'Invalid token or expired token' 
            });
        }
        req.decoded = decoded;

        next();// Call the next middleware function
    });
};

// // Middleware function for user authentication
// const authenticateUser = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         req.body.username = jwt.verify(token, "secretKey");

//         // req.body.username = jwt.verify(token, tokenSecret);
//         next();
//     }
//     catch (error) {
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// }

// Middleware function to verify JWT token
const verificationToken = (req, res, next) => {
    // Extract the token from the request body, query parameters, or headers
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }

    // Verify the token
    jwt.verify(token, 'secretKey', (err, decoded) => {
        /*jwt.verify(token, 'secretKey', callback) verifies the provided JWT token 
        (token) using the specified secret key ('secretKey'). If the token is successfully verified, 
        the callback function is invoked with two arguments: err (an error object) and 
        decoded (the decoded token payload)*/
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate.'
            });
        }
        req.decoded = decoded;
        /*If the token is successfully verified, the 'decoded' parameter contains the 
        decoded token payload. Access the decoded token payload and perform further 
        actions if needed.*/
        next();// Call the next middleware function
    });
};

//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    if (req.headers.token) {
        // If the 'token' header exists, extract the token
        let token = req.headers.token;
        // Verify the token
        jwt.verify(token, 'secretKey', function (error, decoded) {
            if (error) {
                // Log the error and return a 401 Unauthorized response with a message
                console.error('Invalid Token', error.message);
                return res.status(401).json({ 
                    message: 'Invalid Token' 
                });
            } 
            else {
                /*/ If token verification succeeds, extract username
                 and userId from the decoded token*/
                const { username, userId } = decoded;

                req.username = username;
                req.userId = userId;
                              
                next(); // Call the next middleware function in the chain
            }
        });
    } else {
        console.error('No token attached to the request');
        return res.status(401).json({ 
            message: 'No Token Attached to the Request' 
        })
    }
};

//Middleware function to check if the new username provided is valid
const validateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;//Extract the newUsername from the requestBody 
        console.log("Username:", username);

        if (!username || !username.endsWith('@gmail.com')) {
            return res.status(403).json({ 
                message: 'Access Forbidden: Invalid Username' 
            });
        }   


        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        next();// If all conditions pass, call next middleware function
    } 
    catch (error) {
        //Log an error message in the console for debugging purposes
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }  

    
};

//Middleware function to limit the length of the task title
const limitTaskLength = (req, res, next) => {
    //Extract the new task title from the request body
    const { newTask } = req.body;
    const maxLength = 140;

    if (newTask && newTask.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    next();// Call the next middleware or route handler
}


//Middleware to enforce the content-type header to be application/json
const enforceContentType = (req, res, next) => {
    // Extract the value of 'Content-Type' header
    const contentType = req.headers['content-type']; 

    if (!contentType || contentType !== 'application/json') {
        return res.status(415).json(
          { message: 'Unsupported Media Type: Content-Type must be application/json'}
        );
    }

    next(); // Call the next middleware or route handler
};

const limitUpdatedTaskLength = (req, res, next) => {
    const { updatedTitle } = req.body;
    const maxLength = 140;

    if (updatedTitle && updatedTitle.length > maxLength) {
        return res.status(400).json({
            message: `The updatedTitle exceeds the maximum length of ${maxLength} characters.`,
        });
    }
    next();
}
// Export the middleware functions for use in other parts of the application
module.exports = {
    authenticationToken,
    checkJwtToken,
    // authenticateUser,
    validateUsername,
    limitTaskLength,
    enforceContentType,
    verificationToken,
    limitUpdatedTaskLength,
}