# TODO LIST

MERN Stack todoList created using Express-generator, create-react-app, MongoDB and Node.js

## TABLE OF CONTENTS
1. [BACK-END](#back-end)
2. [FRONT-END](#front-end)
3. [MONGODB](#mongodb)
4. [CRUD](#crud)

   
## BACK-END
- npx express-generator
- npm install nodemon
- npm install jsonwebtoken
- npm install cors
- npm install body-parser

The `middleware.js` file contains custom middleware functions to:
- check and verify a JWT token from the 'token' header 
- check if the new username provided is valid
- enforce JSON content type and limit task length
- enforce JSON content type and limit task length of an edited task

The `middleware.js` also imports the `jsonwebtoken` library for handling JSON Web Tokens.

## FRONT-END
- npx create-react-app front-end
- npm install react-bootstrap bootstrap

## MONGODB
- npm install dotenv
- npm install mongoose

```
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
```

## CRUD

| CRUD Operation | HTTP Method | Description                               |
|----------------|-------------|-------------------------------------------|
| Create         | POST        | Create a new resource                     |
| Read           | GET         | Retrieve existing resource(s)             |
| Update         | PUT         | Modify an existing resource               |
| Delete         | DELETE      | Remove an existing resource               |


