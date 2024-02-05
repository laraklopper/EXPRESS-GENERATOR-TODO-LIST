# FETCH TASKS


## Backend:
### USERS.js
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./middleware');
const router = express.Router();

router.use(express.json()); 

// Protected route to retrieve tasks
router.get('/findTasks', authenticateToken, (req, res) => {
    res.json({ tasks });
});

// ... (other routes)

module.exports = router;

```
```
router.get('/findTasks', authenticateToken, (req, res) => {
  try {
    const userTasks = tasks.filter((task) => task.userId === req.user.userId);

    if (userTasks.length > 0) {
      res.json({
        login: true,
        userTasks: req.user,
        tasks: userTasks
      });
    } else {
      res.status(401).json({
        login: false,
        message: 'No tasks found for the authenticated user',
      });
    }

    console.log('Tasks:', userTasks); // Avoid logging sensitive information in production
  } catch (error) {
    console.error('Error finding tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```
### MIDDLEWARE
```
// Middleware function to authenticate a JWT token from the 'Authorization' header
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization; // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1];

    // Conditional rendering to check if the token is missing
    if (!token) return res.status(401).json({ message: 'Token missing in the request header' });
    // If no token is found, send a 401 Unauthorized response

    // Verify the JWT token using the 'verify' method
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {      
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.decoded = decoded;
        next(); // Move to the next middleware in the chain
    });
}


```

## Frontend:

### APP.JS

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

```javascript
useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/findTasks', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
	// Set only the tasks associated with the authenticated user
        setTaskData(fetchedData.tasks); 
        console.log(fetchedData);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  }

  fetchTasks();
}, [token, setTaskData, setError]);
```



