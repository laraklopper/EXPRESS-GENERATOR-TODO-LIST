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
// const { authenticateToken, enforceContentType, limitTaskLength, validateUsername } = require('./routes/middleware');

const port = process.env.PORT || 3001;// Set the port for the server to either the environment variable PORT or 3001

const app = express();//Create an instance of the Express application

app.use(express.json())

// const corsOptions = {
//   origin: 'http://localhost:3001',// Allow requests from this origin
//   methods: 'GET, PUT, POST, DELETE',// Allow specified HTTP methods
//   credentials: true,// Enable credentials (e.g., cookies, authorization headers)
//   optionsSuccessStatus: 204,// Set the status for preflight OPTIONS requests
// }

app.use(cors());// Use CORS middleware 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//===========START THE SERVER============

app.listen(port, () => {// Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${port}`);
})