// Import required libraries and middleware
const express = require('express'); // Import Express.js framework
const jwt = require('jsonwebtoken'); // Import JWT for token generation and verification
const router = express.Router(); // Create a router instance
const cors = require('cors'); // Import CORS middleware for cross-origin resource sharing
// const { checkJwtToken, validateUsername, limitTaskLength, enforceContentType } = require('./middleware');//Import middleware functions


// Middleware to parse JSON bodies
router.use(express.json()); // Parsing JSON requests
router.use(cors()); // Use CORS middleware for cross-origin requests

//===========DATA==================
//----------USER DATA---------------------
//In-memory array used to store the data
let users = [
  {
    id: '0',
    username: 'admin@gmail.com',
    password: 'password1',
  },
  { 
    id: 1,
    username: 'user1@gmail.com',
    password: 'password2',
  },
];
//JSON FORMAT
// users = [
//   {
//     "id": "0",
//     "username": "admin@gmail.com",
//     "password": "passWord1"
//   },
//   {
//     "id": 1,
//     "username": "user1@gmail.com",
//     "password": "passWord2"
//   }
// ]

//----------TASKS DATA---------------------------
// In-memory array used to store the data
let tasks = [
  {
    id: 0,
    user: "admin@gmail.com",
    title: "Implement a Post route for logging in",
  },
  {
    id: 1,
    user: "user1@gmail.com",
    title: "Implement custom middleware to authenticate user",
  },
];
//JSON FORMAT
// [
//   {
//     "id": 0,
//     "user": "admin@gmail.com",
//     "title": "Implement a Post route for logging in"
//   },
//   {
//     "id": 1,
//     "user": "user1@gmail.com",
//     "title": "Implement custom middleware to authenticate user"
//   }
// ]

//Functions
function generateUniqueId(){
  const id = Math.floor(Math.random()*1000)
  return id
}
//=========ROUTES============

// Route to send a GET for the root endpoint '/'
router.get('/', (req, res, next) => {
  res.send('Respond with resource');
});


// Route to send a GET request to the '/findTasks' endpoint
router.get('/findTasks', /*checkJwtToken,*/ (req, res) => {
  const taskId = req.query.taskId; // Extracts the taskId from the query parameters

  // Conditional rendering to check if taskId is provided in the request
  if (taskId) { 
    const task = tasks.find(task => task.id === parseInt(taskId)); // Find the task with the specified taskId
    //parseInt()  is used to accept the string and radix parameter and convert it into an integer.
    return task ? res.json(task) : res.status(404).json({ message: 'Task not found' }); // Returns the task if found, or a 404 error if not found
  } 

  res.json(tasks); // If no taskId is not provided, return all tasks
});

//Route to send a POST request to the users/login endpoint
router.post("/login", (req, res) => {
  console.log('Login User');
  console.log(req.body);
  try {
    const { username, password } = req.body;//Extract the username and password from the request body

    let foundUser = null; //Initialise a variable to store the found user
    console.log('user login');

    // Loop through the users array to find matching username and password
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        foundUser = users[i]; // If match found, assign user object to foundUser
        break; // Exit the loop once a matching user is found
      }
    }
      //If a user is found, create and return a JWT token
    if (foundUser) {
      // Create JWT token containing username and userId
      const jwtToken = jwt.sign({
        username: foundUser.username,
        userId: foundUser.id
      },
        'secretKey',// Secret key used for signing the token
        {
          expiresIn: '12h',// Token expiration time
          algorithm: 'HS256'//algorithm used to sign the JWT token
          
        });
      res.json({ token: jwtToken });
      localStorage.setItem({'token': jwtToken})
    
    }

  } catch (error) {
    console.error('Login failed: Username or password are incorrect');//Log an error message in the console for debugging purposes
    res.status(401).json({ message: "User not Authenticated" });//Respond with a 401 unauthorised response
  }
  // const { username, password } = req.body;//Extract the username and password from the request body
  // let foundUser = null; //Initialise a variable to store the found user
  // console.log('user login');


  // // Loop through the users array to find matching username and password
  // for (let i = 0; i < users.length; i++) {
  //   if (users[i].username === username && users[i].password === password) {
  //     foundUser = users[i]; // If match found, assign user object to foundUser
  //     break; // Exit the loop once a matching user is found
  //   }
  // }

  // //If a user is found, create and return a JWT token
  //   if (foundUser) {
  //     // Create JWT token containing username and userId
  //     const jwtToken = jwt.sign({
  //       username: foundUser.username,
  //       userId: foundUser.id
  //     },
  //       'secretKey',// Secret key used for signing the token
  //       {
  //         expiresIn: '12h',// Token expiration time
  //         algorithm: 'HS256'//algorithm used to sign the JWT token
          
  //       });
  //     res.json({ token: jwtToken });
  //     // localStorage.setItem({'token': jwtToken})
  //   }
  //   else {
  //     console.error('Login failed: Username or password are incorrect');//Log an error message in the console for debugging purposes
  //     res.status(401).json({ message: "User not Authenticated" });//Respond with a 401 unauthorised response
  //   }
  });



//Route to send a POST request to the users/register endpoint
router.post('/register', /*validateUsername,*/ (req, res) => {
  console.log('register user');
  console.log(req.body);
  try {
    const { newUsername, newPassword } = req.body; // Extracts new username and password from the request body

    if (!newUsername || !newPassword) {
      // If username or password is missing, return a 400 Bad Request response
      return res.status(400).json({ message: 'Username and password are required' });
    }
      //Conditional rendering to check if the username already exist
    else if (
      users.find((user) => user.username === newUsername)
      /*users.some((user) => user.username === newUsername)*/
    ) {
      return res.status(409).json({ message: 'Username is already taken' });// If username already exists, return a 409 Conflict response
    }
    else {
      // If username is unique, (the username does not yet already exist) generate a unique user ID and create a new user object
      const newUserId = generateUniqueId(); // This function generates a unique user ID 
     
       // Create a new user object with the provided username, password, and generated ID
      const newUser = { id: newUserId, username: newUsername, password: newPassword };

      users.push(newUser); // Add the new user to the users array
      console.log(users);//Log the updated code in the console for debugging purposes
    }
  } catch (error) {
    // If an error occurs during user registration, log the error and return a 500 Internal Server Error response
    console.error('Error occurred while adding user:', error);//Log an error message in the console for deugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });//Return a 500 Internal Server Error response 
  }
});

// Route for sending a POST request to users/addTask endpoint
router.post('/addTask',/*limitTaskLength, enforceContentType, */  (req, res) => {
  const { user, title } = req.body; // Extract the user and title from the request body

  //Conditional rendering to check if the title or user is missing
  if (!title || !user) {
    //Return a 400 Bad Request status response with a message if the task name already exists
    return res.status(400).json({ message: 'User and task name are required' });
  }
  //Conditional rendering to check if a task with the same title already exists
  if (tasks.some((task) => task.title === title && task.user === user)) {
    //Return a 409(conflict) rspons with a message if the task title already exists
    return res.status(409).json({ message: 'Task title already exists' });
  }
  
  // If the task title is unique, create a new task object
  const newTaskObject = { taskId: tasks.length + 1, title };
  tasks.push(newTaskObject); // Add the new task object to the tasks array
  res.json(newTaskObject); // Respond with the new task object in JSON format
});


module.exports = router;//Export the router to make it available in other parts of the application
