const jwt = require ('jsonwebtoken')

const authenticationToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Forbidden - No token provided' });
    }

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.user = user;
        next();
    });
};

const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;    
    console.log(username);

    if (username && username.endsWith('@gmail.com')) {

       
    } else {
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    } 
    next();
};

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

module.exports = {
    authenticationToken,
    validateUsername,
    limitTaskLength,
    enforceContentType,
}