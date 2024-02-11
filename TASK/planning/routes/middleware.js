const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


// Middleware function to authenticate a JWT token from the 'Authorization' header
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;   
//     const token = authHeader && authHeader.split(' ')[1];     

    
//     if (!token) return res.status(401).json({ message: 'Token missing in the request header' });
    

//     jwt.verify(token, "secretKey", (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Invalid or expired token' });
//         }
        
//         req.decoded = decoded;
//         next();
//     });
// }

// Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {

    if (req.headers.token) {
        let token = req.headers.token;
        jwt.verify(token, "secretKey", function (error, user) {
            if (error) {
                // console.error('JWT Verification Error:', error);
               
                res.send({ message: 'Invalid Token' });
                next();

            } 
            else {
                // req.user = user;
                req.username = data.username;
                req.password = data.password;
                next();
            }
        })
    } else {
        // res.status(401).json({ message: 'No token attached to the request' });
        res.send({ message: 'No Token Attatched to the Response' })
    }
};


// Middleware function for user authentication
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.body.username = jwt.verify(token, "secretKey");

        // req.body.username = jwt.verify(token, tokenSecret);
        next();        
    } 
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}

// Middleware function to validate the format of a username 
const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;   
    console.log(username);

    if (username && username.endsWith('@gmail.com')) {

        next();
    } 
    else {
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};

// const validateUsername = (req, res, next) => {
//     const username = req.body.newUsername;
//
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//
//     if (username && emailRegex.test(username) && username.endsWith('@gmail.com')) {
//
//         next();
//     } 
//     else {
//         res.status(403).json({ message: 'Access Forbidden: Invalid email format' });
//     }
//  };

// Middleware function to limit the length of a task title
const limitTaskLength =(req, res, next) => {
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
const enforceContentType = (req, res, next) => {
    const contentType = req.headers['Content-Type'];   

    if (!contentType || contentType.indexOf('application/json') !== 0) {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    next();
}

//Middleware function to limit the length of an updated task
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
    // authenticateToken,// Middleware function to authenticate a JWT token from the 'Authorization' header
    checkJwtToken,// Middleware function to check and verify a JWT token from the 'token' header
    authenticateUser,// Middleware function for user authentication
    validateUsername,// Middleware function to validate the format of a username
    limitTaskLength,// Middleware function to limit the length of a task title
    enforceContentType,// Middleware function to enforce the 'Content-Type' header to be 'application/json'
    limitUpdatedTaskLength,//Middleware function to limit the length of an updated task
}
