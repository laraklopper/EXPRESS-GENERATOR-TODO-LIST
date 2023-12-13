# EXAMPLE

## SETUP
```
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
```
## ENDPOINTS

### REGISTER
```javascript
// Import necessary modules and libraries
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const secret = 'your_secret_key'; // Replace with a strong and secure secret key

// Define a route for user registration using the POST method
router.post("/register", (req, res) => {
    // Hash the user's password using bcrypt with a salt factor of 10
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create a new user in the database using the User model
    User.create({
        email: req.body.email,
        password: hashedPassword,
    }).then((user) => {
        // If user creation is successful, create a JWT (JSON Web Token) for authentication
        let token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400 // Token expires in 24 hours (in seconds)
        });

        // Respond with a success status (201 Created) and send the token in the response
        return res.status(201).send({ auth: true, token: token });
    }).catch((err) => {
        // If there's an error during user creation, send an error response
        return res.send(err);
    });
});
```

### LOGIN

```
router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('Invalid Credentials');
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, msg: 'Invalid Credentials' });
        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});

```
