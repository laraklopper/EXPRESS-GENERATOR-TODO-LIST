const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens

// Middleware function to authenticate requests using JWT token
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers.authorization;// Express headers are auto converted to lowercase
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing in request header' });
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token or expired token' });
        }
        req.decoded = decoded;
        next();
    });
};


//Middleware to check and verify a JWT token from 'token' header
const checkJwtToken = (req, res, next) => {
    if (req.headers.token) {
        let token = req.headers.token;

        jwt.verify(token, 'secretKey', (error, data) => {
            if (error) {
                res.json({ message: 'Invalid Token' })
                console.error('Invalid Token');
                return res.status(401).json({ message: 'Invalid Token' })
            } else {
                req.username = data.username
                req.password = data.password
                next()
            }
        })
    }
    else {
        res.send({ message: 'No token attatched to the request' })
        return res.status(401).json({ message: 'No token attatched to the request' });
    }
}

//Middleware function to check if the provided username is valid
// const validateUsername = (req, res, next) => {
//     const { newUsername } = req.body;
//     console.log(newUsername);

//     if (!newUsername || !newPassword.endsWith('gmail.com ')) {
//         return res.status(403).json({ message: 'Access frobidden: Invalid Username' })
//     }
//     next();
// }
const validateUsername = (req, res, next) => {
    const { newUsername } = req.body;

    if (!newUsername || !newUsername.endsWith('gmail.com')) {
        return res.status(403).json({ message: 'Access forbidden: Invalid Username' });
    }
    else if (users.find((user) => user.username === newUsername)) {
        return res.status(409).json({ message: 'Username is already taken' });
    }
    
    next();
};


//Middleware function to limit the length of the task title
const limitTaskLength = (req, res, next) => {
    const { newTask } = req.body;
    const maxLength = 140;
    if (newTask && newTask.length > maxLength) {

        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    next();
}

//Middleware to enforce the content-type header to be application/json
const enforceContentType = (req, res, next) => {
    const contentType = req.headers['content-type'];

    if (!contentType || contentType !== 'application/json') {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }
    next();
};

// Export the middleware functions for use in other parts of the application
module.exports = {
    authenticationToken,
    checkJwtToken,
    validateUsername,
    limitTaskLength,
    enforceContentType
}
