const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.decoded = decoded;
        next();
    });
}

const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;
    console.log(username);

    if (username && username.endsWith('@gmail.com')) {
        next();
    } else {
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
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