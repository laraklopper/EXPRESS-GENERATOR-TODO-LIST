//Import required modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();// Create an Express application

const port = process.env.PORT || 3001;// Set the port to either the environment port or 3001

// Middleware setup
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(cors()); // Enable Cross-Origin Resource Sharing

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware setup for logging, parsing cookies, and serving static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route handlers
// Use the index router for requests to the root path
app.use('/', indexRouter);
// Use the users router for requests to the '/users' path
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // Forward to error handler with 404 status
  next(createError(404));
});

// Middleware to handle 404 errors (Page Not Found)
app.use(function(err, req, res, next) {
// Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Export the app object from the module
module.exports = app;

//===========START THE SERVER============
/*Start the server and listen on the specified port 
and log a messag in the console indicating the server is running */ 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})