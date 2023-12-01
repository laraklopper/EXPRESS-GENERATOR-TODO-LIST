const express = require('express');//Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');//Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT).
const { checkJWTToken } = require('./middleware'); //Import Middleware functions
// Create an Express router which can be used to define a route for the application.
const router = express.Router();


// Sample user data
const users = [{
  username: 'user1@gmail.co.za',
  password: 'passWord1',
},
{
  username: 'user2@gmail.co.za',
  password: 'passWord2'
}
];

// Sample tasks data 
let tasks = [{
  username: "user1@gmail.co.za",
  id: 1,
  title: 'Task1',
},{
  username: 'user1@gmail.co.za',
  id: 2,
  title: 'Task2',
},
 {
   username: 'user2@gmail.co.za',
   id: 3,
   title: 'Task3',
 },
 {
   username: 'user2@gmail.co.za',
   id: 4,
     title: 'Task4'
 }
]

// Route for user login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;  // Extract username and password from the request body

//Search for a user with the provided username and password in the users array.
  const user = users.find(user => user.username === username && user.password === password);  // Find the user with the provided credentials

 // Check if a user with matching credentials is found
  if (user) {
    // Generate a JWT token for the authenticated user
    const jwtToken = jwt.sign({//Use the jwt.sign method to generate a JWT token.
      username: users.username,//Users username
      password: users.password,//User password
    },
      'secretKey', // Secret key used for signing the token 
          { expiresIn: '1h' });//Token expiration time

    res.json({ token : jwtToken }); // Send the token in the response
  } else {
    // If the credentials are incorrect, send a 401 Unauthorized response
    res.status(401).json({ message: "User not authenticated" });
  }
});

// Route for user registration
router.post('/register', (req, res, next) => {
  const { newUsername, newPassword } = req.body

  //conditional rendering to check if the username and password are provided
  if (!newUsername || !newPassword) {
    //If no username or password is provided send a 400 (bad request) status response
    return res.status(400).json({ message: 'Username and password are required' });
  }
/*The 400 Bad Request response status code indicates that the server cannot or will not process the request due to 
something that is perceived to be a client error*/

  //Conditional rendering to check if the username is already taken
  if (users.some(user => user.username === newUsername)) { 
    //If the username already exists send a 409 (Conflict) status response
    return res.status(409).json({ message: 'Username is already taken' });
  }
/*The 409 Conflict response status code indicates a request conflict with the current state of the target resource.*/
  
  // Store the user data
  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);

  // Generate a JWT token for the newly registered user
  const token = jwt.sign({ username: newUser.username }, 'secretKey', { expiresIn: '1h' });

  res.json({ token });

})

// Protected route to retrieve tasks which requires a valid JWT token
router.get('/', checkJWTToken, function(req, res){
  res.json(tasks)// Send tasks in the response directly as JSON data
})
/*The checkJWTToken middleware is defined in a separate file (./middleware) is used to 
verify the JWT token before allowing access to protected routes.*/

//Route for adding a newTask
router.post('/addTask', (req, res) =>{
  try {
    const { newTask } = req.body//Extract the new task value from the request body

    // Conditional rendering to check if the new task value is provided
    if (!newTask) {
      //If no taskname is provided send a 400 (bad request) status response
      return res.status(400).json({ message: "Task name is required" });
    }

    // Conditional rendering to check if the task title already exists in the tasks array
    if (tasks.some(task => task.title === newTask)) {
      return res.status(409).json({ message: "Task title already exists" });
    }

    // Create a new task object with a unique ID
    const newTaskObject = {
      id: tasks.length + 1,
      title: newTask
    };

    tasks.push(newTaskObject);    // Add the new task object to the tasks array
    res.json(newTaskObject);    // Respond with the newly added task object in JSON format
  } 
  catch (error) {
    console.error('Error adding task:', error.message);//Display a error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 (internal error status) and a error message
  }
})

module.exports = router;//Export the router to be used in other parts of the appliction
