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


const addUser = async () => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3001/users/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ newUsername: newUserData.newUsername, newPassword: newUserData.newPassword }),
        });

        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            if (data.token) {
                console.log('New user successfully added');
                // You might want to handle users locally in your React app
            } else {
                throw new Error('Invalid server response');
            }
        } else {
            throw new Error('Failed to add new user');
        }
    } catch (error) {
        console.error('Error adding new user:', error.message);
        setError(`Error adding new user: ${error.message}`);
    }
};
```

**Potential Improvements and Error Fixes:**

1. **Import 'jsonwebtoken':** Make sure to import the 'jsonwebtoken' library in the `users.js` file.
2. **Handle Users Locally:** In the frontend, after successfully adding a new user, consider handling users locally in your React app. Right now, you're saving the token and might want to store user details as well.

