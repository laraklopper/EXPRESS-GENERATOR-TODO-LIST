const express = require('express');//Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');//Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT).

// Create an Express router which can be used to define a route for the application.
const router = express.Router();


//Sample data
const users = [{
  username: 'user1@gmail.com',
  password: 'passWord1',
},
{
  username: 'user2@gmail.com',
  password: 'passWord2'
}
];

let tasks = [{
  username: "user1@gmail.com",
  id: 1,
  title: 'Task1',
},
 {
   username: "user2@gmail.co.za",
   id: 2 ,
   title: 'Task2',
 }
]

// Route for user login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;// Extract username and password from the request body


  const user = users.find(user => user.username === username && user.password === password);//Find the user based on the provided credentials

//Conditional rendering to check if a user with the matching credentials is found
  if (user) {
    // Generate a JWT token for the authenticated user
    const jwtToken = jwt.sign({//Use the jwt.sign method to generate a JWT token.
      username: user.username,//Users username
      password: user.password,//User password
    },
      'secretKey', // Secret key used for signing the token
      { expiresIn: '1h' });//Token expiration time

    res.json({ token : jwtToken }); // Send the token in the response
  } else {
    // If the credentials are incorrect, send a 401 Unauthorized response
    res.status(401).json({ message: "User not authenticated" });
  }
});

//-----------Route to register a new user-------------------------
router.post('/register', (req, res, next) => {
  const { newUsername, newPassword } = req.body

  //Conditional rendering to check if the username and password are provided
  if (!newUsername || !newPassword) {
    //If no username or password is provided send a 400 (bad request) status response
    return res.status(400).json({ message: 'Username and password are required' });
  }
  //Conditional rendering to check if the username is already taken
  if (users.some(user => user.username === newUsername)) {
    //If the username already exists send a 409 (Conflict) status response
    return res.status(409).json({ message: 'Username is already taken' });
  }

  // Store the user data
  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);

  // Generate a JWT token for the newly registered user
  const token = jwt.sign
  ({ username: newUser.username }, 
    'secretKey',  // Secret key used for signing the token
    { expiresIn: '1h' });//Token expiration time

  res.json({ token });// Send the token in the response

})

// Protected route to retrieve tasks which requires a valid JWT token
router.get('/findTasks',  function (req, res) {
  try {
    setTimeout(()=>{
      res.json(tasks)// Send tasks in the response directly as JSON data
    }, 1000);//Stimulate a one second delay
  } catch (error) {
    console.error('Error fetching tasks', error.message);//Display an error message in the console for debugging purposes
    res.status(500)
  }
})



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

  } catch (error) {
    console.error('Error adding task:', error.message);//Display a error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 (internal error status) and a error message
  }
 
})
module.exports = router;//Export the router to be used in other parts of the appliction
