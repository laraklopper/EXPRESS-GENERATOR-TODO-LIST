let jwt = require('jsonwebtoken');// Import the jsonwebtoken library


// Middleware function for checking JWT token
function checkJWTToken(req, res, next) {
    // Conditional rendering to check if the 'token' header is present in the request
    if (req.headers.token) {
        // Verify the token using the secret key
        jwt.verify(req.headers.token, "secretKey", function (error, data) {
            if (error) {
                // If the token is invalid, send a 401 Unauthorized response
                res.status(401).send({ message: "Invalid Token" });
                next(); // Move to the next middleware or route handler
            } 
            else {
                // If the token is valid, extract username and password and attach them to the request
                req.username = data.username;
                req.password = data.password;
                next(); // Move to the next middleware or route handler
            }
        });
    } 
    else {
        // If the 'token' header is not present, send a response indicating no token
        res.send({ message: "No token attached to the request" });
    }
}

// Export the middleware function for use in other parts of the application
module.exports = {
    checkJWTToken,
};
