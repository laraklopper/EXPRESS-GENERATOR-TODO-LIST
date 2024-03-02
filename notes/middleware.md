# MIDDLEWARE

```
router.post('/login', (req, res) => {
    const { username, password } = req.body;

   
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);

        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});


```
```
const authenticateJWT = (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (authHeader) {
        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, accessTokenSecret, (err, user) => {
            // Check for errors during token verification
            if (err) {
                // If there's an error, send 403 Forbidden status
                return res.sendStatus(403);
            }

            // If token is valid, attach the user object to the request for further use
            req.user = user;
            // Call the next middleware function
            next();
        });
    } else {
        // If Authorization header is missing, send 401 Unauthorized status
        res.sendStatus(401);
    }
};

```
