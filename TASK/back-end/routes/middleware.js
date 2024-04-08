// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');


//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    const token = req.headers.authorization; // Extract token from request headers
    // Conditional rendering to check if token is missing
    if (!token) {
        // If token is missing, return a 401 Unauthorized response with an error message
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
    try {
        // If the token is presentv verify the token using the jwt.verify method
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded //If verification is successful attach decoded user information to the request object

        console.log('Token provided');// Log a message in the console indicating that a token was provided
        next()// Call the next middleware in the chain
    } 
    catch (error) {
        console.error('No token attached to the request');//Log an error message in the console for debugging purposes
        return res.status(403).json({ message: 'Forbidden: Invalid token' });//return a 403 Forbidden response with an error message
    }
};

//Middleware function to check if the new username provided is valid
const validateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;//Extract the newUsername from the requestBody 
        console.log("Username:", username);// Log the extracted username for debugging purposes

        // Conditional rendering to check if the username is missing or does not end with '@gmail.com'
        if (!username || !username.endsWith('@gmail.com')) {
            
            console.error('Access Forbidden: Invalid Username');//Log an error message in the console for debugging purposes
            // If the username is invalid, return a 403 Forbidden response
            return res.status(403).json({ message: 'Access Forbidden: Invalid Username'});
            
        }   
        next();// If all conditions pass, call next middleware function
    } 
    catch (error) {
        console.error(`Error validating username`, error.message);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error' });// Return a 500 Internal Server Error response
    }     
};

// Custom middleware to enforce JSON content type and limit task length
function validateTask(req, res, next) {
    // Extract the value of 'Content-Type' header
    const contentType = req.headers['content-type'];
    // Conditional rendering to check if 'Content-Type' header is missing or not 'application/json'
    if (!contentType || contentType !== 'application/json') {
        //If the content-type is not JSON return a 400 bad resquest response with an error message
        return res.status(400).json({ message: 'Content-Type must be application/json' });
    }
    const { user, title } = req.body; // Extract user and title from request body
    
    //Conditional rendering to check if the user or title is missing
    if (!user || !title) {
        // If 'user' or 'title' is missing, return a 400 Bad Request response
        return res.status(400).json({ message: 'User and title are required' });
    }
    //Conditional rendering to check if the title exceeds 140 characters
    if (title.length > 140) {
        // If the length of the 'title' exceeds 140 characters, return a 400 Bad Request response
        return res.status(400).json({ message: 'Task title must be 140 characters or less' });
    }

    next(); // Move to the next middleware
}

// Custom middleware to enforce JSON content type and limit task length of an edited task
const validateUpdatedTask = (req, res, next) => {
    const contentType = req.headers['content-type'];//Extract the value of the 'Content-Type' header from the request headers 
    //Conditional rendering to checks if the 'Content-Type' header is missing or not set to 'application/json'
    if (!contentType || contentType !== 'application/json') {
        //If the content-type is not JSON return a 400 bad resquest response with an error message
        return res.status(400).json({ message: 'Content-Type must be application/json' });
    }
    // console.log(req.body);
    const { newUser, newTitle } = req.body// Extract newUser and newTitle from request body

    // Conditional rendering to check the if newUser or newTitle is missing
    if (!newUser || !newTitle) {
        // If 'newUser' or 'newTitle' is missing, return a 400 Bad Request response
        return res.status(400).json({ message: 'User and title are required' });
    }
    //Conditional rendering to check if the newTitle length exceedes 140 characters
    if (newTitle.length > 140) {
        // If the length of the 'newTitle' exceeds 140 characters, return a 400 Bad Request response
        return res.status(400).json({ message: 'Task title must be 140 characters or less' });
    }
    next(); // Move to the next middleware

}


// Export the middleware functions for use in other parts of the application
module.exports = {
    checkJwtToken,
    validateUsername,
    validateTask,
    validateUpdatedTask,
}