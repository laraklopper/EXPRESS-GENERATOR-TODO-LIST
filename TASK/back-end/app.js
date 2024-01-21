// Import necessary modules and packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// Import routes and middleware from the specified files
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Import custom middleware functions from './routes/middleware'
const { authenticateToken, enforceContentType, limitTaskLength, validateUsername } = require('./routes/middleware');
const port = process.env.PORT || 3001;// Set the port for the server to either the environment variable PORT or 3001
const app = express();//Create an instance of the Express application

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET, PUT, POST, DELETE', // Allow specified HTTP methods
  credentials: true, // Enable credentials (e.g., cookies, authorization headers)
  optionsSuccessStatus: 204, // Set the status for preflight OPTIONS requests
}

// Use CORS middleware with the specified options
app.use(cors(corsOptions))


// Set up the view engine and directory for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set up middleware for logging, parsing JSON, parsing URL-encoded data, parsing cookies, and serving static files
app.use(logger('dev'));
app.use(express.json());//Built in express middleware function in express used to Parse the incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use the defined routes for specific paths
app.use('/', indexRouter);
app.use('/users', validateUsername, authenticateToken, enforceContentType, limitTaskLength, usersRouter);

// Handle 404 errors by forwarding to the error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handling middleware
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page with an 500 Internal Server Error status code
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//===========START THE SERVER============
app.listen(port, () => {// Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${port}`);
})
