// Import necessary modules and packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Load environment variables from .env file
require('dotenv').config();
const app = express();// Create an Express application

//--- Extract Environmental Variables---------------
const port = process.env.PORT || 3001;
const uri = process.env.DATABASE_URL;
const database = process.env.DATABASE_NAME;

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=============
// Conditional rendering to check if an environment variable is missing
if (!port || !database || !uri) {
  console.error('Error: Required environmental variables are missing');
  process.exit(1);
}
//==============CONNECT TO MONGODB USING MONGOOSE=======================
mongoose.Promise = global.Promise;

mongoose.connect(uri, {
  useNewUrlParser: true,
  dbName: database,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err); 
  });

//==============MONGO CONNECTION EVENT HANDLERS========================
// Set up an event listener for the 'error' event on the Mongoose connection 
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', function (error) {
  console.log('Could not connect to the database. Exiting now...', error);
  process.exit(1);
});

// Set up an event listener for the 'open' event on the Mongoose connection
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', function () {
  console.log('Successfully connected to database');
});

// Set up the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//======================SETUP MIDDLEWARE================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); 


// Routes setup
app.use('/', indexRouter); 
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500); 
  res.render('error');
});

//================START THE SERVER=========================
// Start the Express server and listen on the specified port
app.listen(port, () => { 
  console.log('Application is running on port: ' + port);
})


module.exports = app;// Export the Express application
