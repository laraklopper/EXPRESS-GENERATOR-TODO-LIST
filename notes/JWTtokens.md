# JSON WEB TOKENS

generate JWT tokens on the server side, and handle token storage and inclusion in your requests on the client side.

## EXAMPLE

### How to use the `fetch` API for making HTTP requests in React and Express for handling the backend.

#### Server-Side (Express)

1. **Install necessary packages:**

   Make sure you have the `jsonwebtoken` package installed in your Express project.

   ```bash
   npm install jsonwebtoken
   ```

2. **Create a middleware for authentication:**

   Create a middleware function that checks the presence and validity of the JWT token in the incoming requests.

   ```javascript
   // authMiddleware.js
   const jwt = require('jsonwebtoken');

   module.exports = (req, res, next) => {
     const token = req.headers.authorization;

     if (!token) {
       return res.status(401).json({ message: 'Unauthorized' });
     }

     jwt.verify(token, 'your-secret-key', (err, decoded) => {
       if (err) {
         return res.status(401).json({ message: 'Token is not valid' });
       }
       req.user = decoded.user;
       next();
     });
   };
   ```

3. **Create a route for token generation:**

   Create a route in your Express application to generate and return a JWT token upon successful authentication.

   ```javascript
   // authRoutes.js
   const express = require('express');
   const jwt = require('jsonwebtoken');
   const authMiddleware = require('./authMiddleware');

   const router = express.Router();

   router.post('/login', (req, res) => {
     // Validate user credentials 
     const { username, password } = req.body;
     if (username === 'user' && password === 'password') {
       const token = jwt.sign({ user: username }, 'your-secret-key', { expiresIn: '1h' });
       res.json({ token });
     } else {
       res.status(401).json({ message: 'Invalid credentials' });
     }
   });

   router.get('/protected', authMiddleware, (req, res) => {
     res.json({ message: 'You have access to this protected resource' });
   });

   module.exports = router;
   ```

#### Client-Side (React)

1. **Handle authentication in your React component:**

   Create a component where users can log in and obtain a JWT token.

   ```jsx
   // Login.js
   import React, { useState } from 'react';

   const Login = ({ setToken }) => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');

     const handleLogin = async () => {
       try {
         const response = await fetch('http://localhost:3001/login', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ username, password }),
         });

         const data = await response.json();

         if (response.ok) {
           setToken(data.token);
         } else {
           console.error('Login failed:', data.message);
         }
       } catch (error) {
         console.error('Error during login:', error.message);
       }
     };

     return (
       <div>
         <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
         <button onClick={handleLogin}>Login</button>
       </div>
     );
   };

   export default Login;
   ```

2. **Make authenticated requests using the token:**

   In components where you need to make authenticated requests, include the JWT token in the `Authorization` header.

   ```jsx
   // ProtectedComponent.js
   import React, { useEffect, useState } from 'react';

   const ProtectedComponent = ({ token }) => {
     const [data, setData] = useState(null);

     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await fetch('http://localhost:3001/protected', {
             method: 'GET',
             headers: {
               'Content-Type': 'application/json',
               Authorization: token ? `Bearer ${token}` : '',
             },
           });

           const result = await response.json();

           if (response.ok) {
             setData(result);
           } else {
             console.error('Error fetching protected data:', result.message);
           }
         } catch (error) {
           console.error('Error during fetch:', error.message);
         }
       };

       fetchData();
     }, [token]);

     return (
       <div>
         {data ? (
           <p>{data.message}</p>
         ) : (
           <p>Loading...</p>
         )}
       </div>
     );
   };

   export default ProtectedComponent;
   ```

3. **Implement a higher-level component to manage the token state:**

   Create a higher-level component that manages the token state and passes it down to child components.

   ```jsx
   // AuthProvider.js
   import React, { useState } from 'react';
   import Login from './Login';
   import ProtectedComponent from './ProtectedComponent';

   const AuthProvider = () => {
     const [token, setToken] = useState(null);

     return (
       <div>
         {token ? (
           <ProtectedComponent token={token} />
         ) : (
           <Login setToken={setToken} />
         )}
       </div>
     );
   };

   export default AuthProvider;
   ```

   This higher-level component (`AuthProvider`) will render either the protected component or the login component based on the existence of the token.
