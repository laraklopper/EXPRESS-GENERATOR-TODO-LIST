const express = require('express');// Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');// Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT)
const { // Import custom middleware functions 
  authenticateToken, // Middleware used  to authenticate a user based on a JSON Web Token (JWT) passed in the `Authorization` header of the incoming request.
  limitTaskLength, // Middleware to check if the length of the `newTask` property in the request body exceeds a maximum length (140 characters).
  enforceContentType, // Middleware used to enforce the content-type of the request(application/json)
  validateUsername //Middleware checks if the `newUsername` property exists in the request body and if it ends with '@gmail.com'.
      } = require('./middleware');
const router = express.Router();// Create an Express router which can be used to define routes for the application

express.json()
//Sample data
const users = [
  {
    username: 'user1@gmail.com',
    password: 'passWord1',
  },
  {
    username: 'user2@gmail.com',
    password: 'passWord2',
  },
];

let tasks = [
  {
    username: 'user1@gmail.com',
    id: 1,
    title: 'Task1',
  },
  {
    username: 'user2@gmail.com',
    id: 2,
    title: 'Task2',
  },
];

//Test route
router.get('/', (req, res)=>{
  try {
    res.send(tasks)
    console.log('success message');//Log a success message in the console
  } 
  catch (error) {
    res.send.status(500).json('Internal Server Error')//Respond with a 500 Internal Server Error status
  }
  
})
//=============ROUTES===============
//----------------GET REQUEST------------------
// Protected route to retrieve tasks
router.get('/findTasks', authenticateToken, async (req, res) => {//Define the route for the HTTP request
  //The `authenticateToken` middleware ensures that the request is only processed if a valid token is present in the request header.
  try {
    res.send(JSON.stringify(tasks));// Send a JSON response containing the list of tasks
    // Use `JSON.stringify` to convert the `tasks` array into a JSON-formatted string before sending it.
    console.log(JSON.stringify(tasks));// Log the tasks in JSON format to the console
  } 
  catch (error) {
    //Handle any errors that may occur during the request
    console.error('Error fetching tasks', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 Internal Server Error status with a JSON object containing a message
  
}});


//----------------------POST REQUESTS----------------------------

// Route for user login
router.post("/login", (req, res) => {//Define the route for the HTTP request
  // const authHeader = req.headers['authorization'];// Extract the JWT token from the Authorization header
      // const token = authHeader && authHeader.split(' ')[1];
  const { username, password } = req.body;//Extract the username and password from the request body
// Search for a user in the users array with matching username and password.
  const user = users.find(user => user.username === username && user.password === password);
  /*The array.find method is an array method used to find the first element in the array that satifies a provided testing function.
   If no value/element in the array satisfies the provided function, undefined is returned. */
  //Conditional rendering based on whether a user is found
  if (user) {
    // Generate a JWT token for authentication
    const jwtToken = jwt.sign(
      {
        username: user.username,//JWT payload
      },
      'userLoginSecretKey',// secret key used to sign the JWT.
      {
        expiresIn: '1h', // Specify the time until the  JWT will expire  (1 hour).
        algorithm: 'HS256' //Specify the signing algorithm used.
    }
    );
    res.json({ token: jwtToken }); // Respond with a JSON object containing the generated JWT token
    console.log(jwtToken);//Log the generated JWT token to the console
  } 
  else {  
    console.error('Login failed');//Log an error message in the console for debugging purposes
    res.status(401).json({ message: "User not Authenticated" });// Respond with an authentication failure message
  }
});


// Route to register a new user 
router.post('/register', validateUsername, (req, res,) => {//Define the route for the HTTP request
  try {
    const { newUsername, newPassword } = req.body;  // Extract new username and password from the request body

    // Conditional rendering to check if both username and password are provided
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });// If not, respond with a 400 Bad Request status and an error message

    }
    else if (users.find((user) => user.username === newUsername)) {// Conditional rendering to check if the username is already taken
      // If it is, respond with a 409 Conflict status and an error message
      return res.status(409).json({ message: 'Username is already taken' });
    }
    // If username is unique, create a new user object
    const newUser = { username: newUsername, password: newPassword };
    console.log(newUser);//log the newUser in the console
    users.push(newUser);  // Add the new user to the 'users' array

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { username: newUser.username },//JWT payload
      'newUserSecretKey',// secret key used to sign the JWT.
      { expiresIn: '1h' }// Specify the time until the  JWT will expire  (1 hour).
    );

    res.json({ token });  // Respond with the generated JWT token
    console.log(token); //Log the JWT token in the console
  } 
  catch (error) {
    console.error('Error registering user:', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });//Respond with a 500 Internal Server Error status code and an error message
  }


});

//Route to add a new Task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Define the route for the HTTP request
  try {
    const { value } = req.body;// Extract the new task name from the request body

    // Conditional rendering to check if the new task name is provided
    if (!value) {
      return res.status(400).json({ message: 'Task name is required' });// respond with a 400 Bad Request status and an error message
    }
    else if (tasks.some((task) => task.title === value)) {// Conditional rendering  to check if the task title already exists
      return res.status(409).json({ message: 'Task title already exists' });//respond with a 409 Conflict status and an error message
    }
    else {
      // If the new task name is valid and unique, create a new task object
      const newTaskObject = {
        id: tasks.length + 1, // Assign a unique ID to the task by adding 1 to the current length of the 'tasks' array
        title: value,// Assign the title of the new task 
      };
      
      tasks.push(newTaskObject);// Add the new task object to the existing 'tasks' array
      res.json(newTaskObject);// Respond with the details of the newly added task
    }
  } 
  catch (error) {
    //Handle any errors which occur in the try block
    console.error('Error adding task:', error.message);//Log an error message in the console
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500(Internal Server Error) response
  }
});

//--------------------PUT REQUEST--------------------------

//Route to edit an existing task
router.put('/editTask/:id', authenticateToken, limitTaskLength, (req, res) => {//Define the route for the HTTP request
  try{
   const taskId = parseInt(req.params.id);  // Extract the task ID from the URL parameters
  /*parseInt function used to parse a string and convert it to an integer*/
  const updatedTitle = req.body.value;// Extract the updated task title from the request body

  tasks = tasks.map((task) =>  // Update the 'tasks' array by mapping through each task
    //The map function iterates over each element of the array and returns a new array based on the provided callback function.
    task.id === taskId ? { ...task, title: updatedTitle } : task
  );
  // Respond with a 200 OK status and a success message and the updated task list
  res.status(200).json({ success: true, tasks });
});
  }
  catch(error){
    // If an error occurs during the try block, handle it here
  console.error('Error editing tasks', error.message);// Log an error message to the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 Internal Server Error status and a JSON error message          
  }


//--------DELETE REQUEST----------------

//Route to delete a task
router.delete('/deleteTask/:id', authenticateToken, (req, res) => {//Define the route for the HTTP request
  try {
    const taskId = parseInt(req.params.id); // Extract the task ID from the URL parameters and convert it to an integer
    //parseInt function used to parse a string and convert it to an integer
    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);  // Find the index of the task to be deleted in the 'tasks' array

    
    // Conditional rendering to check if the task exists and the user has permission to delete it
    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
     // Return a 404 status with an error message if the task is not found or the user doesn't have permission
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    tasks.splice(taskToDeleteIndex, 1);// Delete the specified task and respond with the updated task list
    /*The array.splice method in JS is used to change the contents of an array by removing or replacing existing
    elements or/and adding new elements*/
    //taskToDeleteIndex:index of the tasks in the tasks array that needs to be deleted
    res.status(200).json(tasks);//Respond with a 200 OK status and the updated task list
  } 
  catch (error) 
  {
    //Handle any errors which occur in the try block
    console.error('Error editing tasks', error.message);// Log an error message to the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 Internal Server Error status and a JSON error message
  }
});

module.exports = router;//Export the router to make it available in other parts of the application

