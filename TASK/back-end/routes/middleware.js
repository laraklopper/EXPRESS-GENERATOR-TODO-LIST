// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');


//------------------FINDTASKS ENDPOINT-------------------

// Middleware function to authenticate requests using JWT token
const authenticationToken = (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Extract the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1];
    //Conditional rendering to check if the token is missing
    if (!token) {
        // If token is missing, return a 401 Unauthorized response
        return res.status(401).json({
            message: 'Token missing in request header'
        });
    }
    // Verify the token using the provided secret key
    jwt.verify(token, 'secretKey', (err, decoded) => {
        // Conditional rendering to check if there's an error during token verification
        if (err) {
            //Conditional rendering to check if error is due to an expired token
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Expired'
                })
            } 
            else {//Contitional rendering to check if the error is due to invalid or expired token
                return res.status(401).json({
                    message: 'Invalid token or expired token'
                })
            };
        }
        req.decoded = decoded;// If token is successfully verified, attach the decoded token to the request object
        next();// Call the next middleware function
    });
};



//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    if (req.headers.token) {
        // If the 'token' header exists, extract the token
        let tokenHeader = req.headers.authorization;
        // const token = tokenHeader.split(' ')[1]// Extract token without 'Bearer' prefix

        // Verify the token
        jwt.verify(token, 'secretKey', function (error, decoded) {
            //Conditional rendering to check if there is an error during token verification
            if (error) {
                
                
                console.error('Invalid Token', error.message);//Log an error message in the console for debugging purposes
                /* If there is an error during token verification log the error and 
                return a 401 Unauthorized response with a message*/
                return res.status(401).json({message: 'Invalid Token' });
            } 
            else {
                /* If token verification succeeds, extract username
                 and userId from the decoded token*/
                const { username, userId } = decoded;
                // Attach username and userId to the request object for further use
                req.username = username;
                req.userId = userId;
                              
                next(); // Call the next middleware function in the chain
            }
        });
    } else {
        console.error('No token attached to the request');//Log an error message in the console for debugging purposes
        return res.status(401).json({message: 'No Token Attached to the Request'});
    }
};

// ----------------REGISTER ENDPOINT-------------------

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

//-------------------ADDTASK ENDPOINT---------------------------------
// Custom middleware to enforce JSON content type and limit task length
function validateTask(req, res, next) {
    // Extract the value of 'Content-Type' header
  const contentType = req.headers['content-type'];
    
  // Conditiontional rendering to check if content type is JSON
  if (!contentType || contentType !== 'application/json') {
    return res.status(400).json({ message: 'Content-Type must be application/json' });
  }

  const { user, title } = req.body;// Extract 'user' and 'title' from the request body

  // Conditional rendering to check if 'user' or 'title' is missing
  if (!user || !title) {
          // If 'user' or 'title' is missing, return a 400 Bad Request response
    return res.status(400).json({ message: 'User and title are required' });
  }
    // Conditional renderinf if task length is within limit
  if (title.length > 140) {
          // If the length of the 'title' exceeds 140 characters, return a 400 Bad Request response
    return res.status(400).json({ message: 'Task title must be 140 characters or less' });
  }

  next(); // Move to the next middleware
}

//Middleware function to limit the length of the task title
const limitTaskLength = (req, res, next) => {
    //Extract the new task title from the request body
    const { newTask } = req.body;
    const maxLength = 140;//Maximumum length
// Conditional rendering to check if the new task title exceeds the maximum length
    if (newTask && newTask.length > maxLength) {
    // If the title exceeds the maximum length, return a 400 Bad Request response
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
    // Conditional rendering if the 'Content-Type' header is missing or not 'application/json'

    if (!contentType || contentType !== 'application/json') {
        // If the 'Content-Type' is missing or not 'application/json', return a 415 Unsupported Media Type response
        return res.status(415).json(
          { message: 'Unsupported Media Type: Content-Type must be application/json'}
        );
    }

    next(); // Call the next middleware or route handler
};

//------------EDITTASK ENDPOINT--------------------

/Custom middleware to limit the updated title length 
const limitUpdatedTaskLength = (req, res, next) => {
    // Extract the updated task title from the request body
    const { updatedTitle } = req.body;
    const maxLength = 140;//Maximum length
    
    // Conditional rendering if the updated task title exceeds the maximum length
    if (updatedTitle && updatedTitle.length > maxLength) {
        // If the title exceeds the maximum length, return a 400 Bad Request response
        return res.status(400).json({
            message: `The updatedTitle exceeds the maximum length of ${maxLength} characters.`,
        });
    }
    next();// Call the next middleware or route handler
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
    validateTask
}
