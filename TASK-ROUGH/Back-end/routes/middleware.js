let jwt = require('jsonwebtoken');

function checkJWTToken(req, res, next) {
    if (req.headers.token) {
        let token = req.headers.token;
        jwt.verify(token, "secretKey", function (error, data) {
            if (error) {
                res.send({ message: "Invalid token" });
            } else {
                req.username = data.username;
                req.password = data.password;
            }
            next();
        });
    } else {
        res.send({ message: "No Token attached to the request" });
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden" });
        }
        req.decoded = decoded;
        next();
    });
}

function limitTaskLength(req, res, next) {
    const {newTask} = req.body;
    const maxLength = 140;

    if (newTask && newTask.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        })
    }
    next()
};

function enforceContentType(req, res, next) {
        const contentType = req.headers['Content-Type'];

    if (!contentType || contentType.indexOf('application/json') !== 0 ) {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
        }
    
    next();

}
function validateUsername( req, res, next) {
    const username = req.body.newUsername;

    if (username && username.endsWith('gmail.com')) {
        next();
    } 
    else {
        res.status(403).json({message: 'Access Forbidden: Invalid username'})
    }
}
module.exports = {
    checkJWTToken,
    authenticateToken,
    limitTaskLength,
    validateUsername, 
    enforceContentType
};
