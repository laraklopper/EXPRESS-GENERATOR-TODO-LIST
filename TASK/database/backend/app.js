const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.DATABASE_URL
const database = process.env.DATABASE_NAME

if (!port) {
  console.error('Error: PORT enviroment variable is missing');
  process.exit(1)
}
if (!database) {
  console.error('Error: DATABASE_NAME enviroment variable is missing');
  process.exit(1)
}
if (!uri) {
  console.error('Error: DATABASE_URL enviroment variable is missing');
  process.exit(1)
}

mongoose.Promise = global.Promise;

mongoose.connect(uri, {
  useMongoClient: true,
  dbName: database,
})
  .then(() =>{
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  })

mongoose.connection.on('error', function (error) {
  console.log('Could not connect to the database. Exiting now...', error);
  process.exit(1);
});

mongoose.connection.once('open', function () {
  console.log('Successfully connected to database');
});

app.use(cors())
app.use(express.json())

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
})
module.exports = app;

