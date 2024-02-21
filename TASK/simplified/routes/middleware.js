const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    if (req.headers.token) {
        let token = req.headers.token;
        jwt.verify(token, 'secretKey', function(error, data){
            if (error) {
                res.send({message: 'Invalid Token'})
                console.error('Invalid Token');
                return res.status(401).json({ message: 'Invalid Token' })
            } else {
                req.username = data.username;
                req.password = data.password;
                next()
            }
        })
    } else {
        res.send({message: 'No token attatched to the request'})
        return res.status(401).json({ message: 'No Token Attached to the Request' });
    }
};


//Middleware function to check if the provided username is valid
const validateUsername = (req, res, next) => {
    const { newUsername } = req.body;
    console.log(newUsername);

    if (!newUsername || !newUsername.endsWith('@gmail.com')) {
        return res.status(403).json({ message: 'Access Forbidden: Invalid Username' });
    }

    next()
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
    const contentType = req.headers['Content-Type'];

    if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    next();
};

// Export the middleware functions for use in other parts of the application
module.exports = {
    checkJwtToken,
    validateUsername,
    limitTaskLength,
    enforceContentType,
}