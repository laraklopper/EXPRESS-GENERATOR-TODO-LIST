const jwt = require('jsonwebtoken');


// Middleware function to authenticate a JWT token from the 'Authorization' header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1]; 
  
    // Conditional rendering to check if the token is missing
    if (!token) return res.status(401).json({ message: 'Token missing in the request header' });
    // If no token is found, send a 401 Unauthorized response

    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.decoded = decoded;
        next();
    });
}
// function authenticationToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);
//     jwt.verify(token, "secretKey", (err, decoded) => {
//         if (err) {
//             return res.sendStatus(403);
//         }

//         req.decoded = decoded;
//         next();
//     });
// }

const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;
    console.log(username);

    if (username && username.endsWith('@gmail.com')) {
        next();
    } else {
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};
// Middleware function to validate the format of a username 

const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;// Extract the newUsername from the request body
    console.log(username);

    // Conditional rendering to check if the username is provided and matches the email format
    if (username && username.endsWith('@gmail.com')) {
        next();// If the username is valid, proceed to the next middleware
    } else {
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
        /* If the username is missing or does not match the format, respond with a 403 Forbidden status
         and a JSON object containing an error message*/
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
// function limitTaskLength(req, res, next) {
//     const { newTask } = req.body;
//     const maxLength = 140;//Max length

//     if (newTask && newTask.title.length > maxLength) {
//         return res.status(400).json({
//             message: `Task title exceeds the maximum length of ${maxLength} characters.`,
//         });
//     }

//     next();
// }
function limitTaskLength(req, res, next) {
    const { newTask } = req.body;
    const maxLength = 140;

    if (newTask && newTask.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    next();
}

// Middleware function to enforce the 'Content-Type' header to be 'application/json'
function enforceContentType(req, res, next) {
    const contentType = req.headers['content-type'];

    if (!contentType || contentType.indexOf('application/json') !== 0) {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    next();
}


module.exports = {
    authenticationToken,
    validateUsername,
    limitTaskLength, 
    enforceContentType,
}
