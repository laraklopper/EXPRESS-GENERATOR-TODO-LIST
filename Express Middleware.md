# EXPRESS MIDDLEWARE

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.
Middleware functions can perform the following tasks:

- Execute any code
- Make  changes to the request & response objects
- End the requests-response cycle
- Call the next middleware function in the stack
## Most commonly used Express middleware:

1. **Body Parser (`body-parser`):**

	npm install body-parser

   - Parses the incoming request body and makes it available under `req.body`.
   - Example:
     ```javascript
     const bodyParser = require('body-parser');
     app.use(bodyParser.json()); // for parsing application/json
     app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
     ```

2. **Express.json():**
   - A built-in middleware similar to `body-parser`, used for parsing JSON in the request body.
   - Example:
     ```javascript
     app.use(express.json());
     ```

3. **Express.urlencoded():**
   - This is a built-in middleware function in Express, which parses incoming requests with urlencoded payloads & is based on body-parser.
   - Example:
     ```javascript
     app.use(express.urlencoded({ extended: true }));
     ```

4. **Morgan (`morgan`):**
	npm install morgan
   - HTTP request logger middleware.
   - Example:
     ```javascript
     const morgan = require('morgan');
     app.use(morgan('dev'));
     ```

5. **Cors (`cors`):**
	npm install cors
   - Middleware to enable Cross-Origin Resource Sharing.
   - Example:
     ```javascript
     const cors = require('cors');
     app.use(cors());
     ```

6. **Helmet (`helmet`):**

npm install --save helmet
   - Adds security headers to the HTTP response to enhance security.
   - Example:
     ```javascript
     const helmet = require('helmet');
     app.use(helmet());
     ```

7. **Cookie Parser (`cookie-parser`):**
   - Parses cookies attached to the client's request object.
   - Example:
     ```javascript
     const cookieParser = require('cookie-parser');
     app.use(cookieParser());
     ```

8. **Express Session (`express-session`):**
	npm install express-session
   - Session middleware for tracking user sessions.
   - Example:
     ```javascript
     const session = require('express-session');
     app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
     ```

9. **Passport (`passport`):**
   - Authentication middleware for Node.js.
   - Example:
     ```javascript
     const passport = require('passport');
     app.use(passport.initialize());
     app.use(passport.session());
     ```

10. **Compression (`compression`):**
    - Gzip compression middleware to reduce response size.
    - Example:
      ```javascript
      const compression = require('compression');
      app.use(compression());
      ```
### app.use()

The `app.use()` method mounts or puts specified middleware functions at the specified path. 
The middleware function will only be executed only when the base of the requested path matches the defined path
