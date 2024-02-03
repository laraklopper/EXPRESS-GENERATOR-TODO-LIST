# ADD USER

## BACKEND

### Middleware.js:

```javascript
// middleware.js

// Middleware function to validate the format of a username 
const validateUsername = (req, res, next) => {
    const username = req.body.newUsername;

    // Conditional rendering to if the username is provided and ends with '@gmail.com'
    if (username && username.endsWith('@gmail.com')) {
        next(); // If the username is valid, proceed to the next middleware or route handler
    } else {
        // If the username is missing or does not end with '@gmail.com', respond with a 403 Forbidden status
        // and a JSON object containing an error message
        res.status(403).json({ message: 'Access Forbidden: Invalid username' });
    }
};

module.exports = {
    validateUsername,
};
```

```javascript
// middleware.js

// Middleware function to validate the format of a username 
const validateUsername = (req, res, next) => {
    // Extract the newUsername from the request body
    const username = req.body.newUsername;

    // Regular expression to check if the username follows a basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the username is provided and matches the email format
    if (username && emailRegex.test(username)) {
        // If the username is valid, proceed to the next middleware or route handler
        next();
    } else {
        // If the username is missing or does not match the format, respond with a 403 Forbidden status
        // and a JSON object containing an error message
        res.status(403).json({ message: 'Access Forbidden: Invalid email format' });
    }
};

// Export the validateUsername middleware to make it available for use in other parts of the application
module.exports = {
    validateUsername,
};
```

Explanation:

1. **Middleware Purpose:**
   The `validateUsername` middleware is designed to check if a provided username (assumed to be an email address) follows a basic email format. It is commonly used as a pre-processing step before handling user registration or similar actions.

2. **Extracting Username:**
   The middleware extracts the `newUsername` from the request body. This assumes that the client is sending the new username as part of the request body.

3. **Regular Expression Check:**
   A regular expression (`emailRegex`) is used to check if the provided username follows a basic email format. This regex ensures that the username contains the "@" symbol and a domain with a dot.

4. **Validation Check:**
   The code checks if the username is provided and matches the email format. If the validation passes, the middleware calls the `next()` function, allowing the request to move to the next middleware or route handler in the chain.

5. **Error Response:**
   If the username is missing or does not match the expected format, the middleware responds with a 403 Forbidden status and a JSON object containing an error message. This communicates to the client that the provided username is not in the expected format.

6. **Exporting Middleware:**
   Finally, the middleware is exported to make it available for use in other files (typically in the user registration route).

This middleware enhances the robustness of your application by ensuring that usernames, assumed to be email addresses, meet a basic format requirement before proceeding with further actions.

### users.js (Backend):

```javascript
// users.js

const jwt = require('jsonwebtoken'); // Make sure to import the 'jsonwebtoken' library

router.post('/register', validateUsername, (req, res) => {
    try {
        const { newUsername, newPassword } = req.body;

        // Conditional rendering to check if the newUsername or newPassword is missing
        if (!newUsername || !newPassword) {
            return res.status(400).json({ message: 'Username and password are required' });
        } else if (users.find((user) => user.username === newUsername)) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        const newUser = { username: newUsername, password: newPassword };
        users.push(newUser);

        console.log('New user registered:', newUser.username);

        // Generate a JWT token for the newly registered user
        const token = jwt.sign(
            { username: newUser.username },
            'newUserSecretKey',
            { expiresIn: '1h' }
        );

        res.json({ token });
        console.log('Generated JWT token:', token);
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
```

## Frontend:

### React.js

```javascript

//Function to add a new User
const addUser = async () => {
    try {
        const token = localStorage.getItem('token');// Retrieve the authentication token from local storage
        //Send a POST request to the server
        const response = await fetch('http://localhost:3001/users/register', {
            method: 'POST',//Request method
            mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing)
            headers: {
                'Content-type': 'application/json',//Specify the type of content being passed
                'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
            },
            // Convert new user data to JSON and send it in the request body
            body: JSON.stringify({ newUsername: newUserData.newUsername, newPassword: newUserData.newPassword }),
        });
        // Conditional rendering to check if the response status is in the successful range (200-299)
        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();// Parse the response data as JSON
            // Conditional rendering to check if the response contains a valid token
            if (data.token) {
                console.log('New user successfully added');//Log a success message in the console
            } else {
                throw new Error('Invalid server response');// Throw an error if the response status is not in the successful range
            }
        } else {
            throw new Error('Failed to add new user');//Throw an error message if the GET request is unsuccessful
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error adding new user:', error.message);//Log an error message in the console for debugging purposes
        setError(`Error adding new user: ${error.message}`);// Set an error message in the state

    }
};
```

**Potential Improvements and Error Fixes:**

1. **Import 'jsonwebtoken':** Make sure to import the 'jsonwebtoken' library in the `users.js` file.
2. **Handle Users Locally:** In the frontend, after successfully adding a new user, consider handling users locally in your React app. Right now, you're saving the token and might want to store user details as well.

