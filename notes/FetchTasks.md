# FETCH TASKS


### Backend:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./middleware');
const router = express.Router();

router.use(express.json());

// Middleware function to authenticate a JWT token from the 'Authorization' header
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization; // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1]; // Corrected the variable name and extracted the token

    // Conditional rendering to check if the token is missing
    if (!token) return res.status(401).json({ message: 'Token missing in the request header' }); // If no token is found, send a 401 Unauthorized response

    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
           
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

      
        req.decoded = decoded;
        next(); // Move to the next middleware in the chain
    });
}

// Protected route to retrieve tasks
router.get('/findTasks', authenticateToken, (req, res) => {
    res.json({ tasks });
});

// ... (other routes)

module.exports = router;
```

### Frontend:

```javascript
// Function to fetchTasks
const fetchTasks = async () => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage

        if (!token) {
            // Handle the case when the token is missing
            setError('Authentication token not found. Please log in.');
            return;
        }

        // Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
            method: 'GET', // Request method
            mode: "cors", // Set the mode to 'cors' (cross-origin resource sharing), indicating that the request is a cross-origin request.
            headers: {
                'Content-Type': 'application/json', // Specify the type of content being passed
                'Authorization': `Bearer ${token}`, // Authorization header as the bearer token
            }
        });

        // Conditional rendering to check if the server response is in the successful range (200-299)
        if (response.status >= 200 && response.status < 300) {
            const fetchedData = await response.json(); // Parse the response body as JSON
            setTaskData(fetchedData.tasks); // Update the taskData state
            console.log(fetchedData.tasks);
        } else {
            // Handle the case when the GET request is unsuccessful
            throw new Error('Failed to fetch tasks');
        }
    } catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`); // Set the error state
        console.error('Error fetching data:', error); // Display an error message in the console for debugging purposes
    }
};
```

