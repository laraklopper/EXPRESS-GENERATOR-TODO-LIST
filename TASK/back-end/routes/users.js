const express = require('express');// Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');// Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT)
const { // Import custom middleware functions 
  authenticateToken, // Middleware used  to authenticate a user based on a JSON Web Token (JWT) passed in the `Authorization` header of the incoming request.
  limitTaskLength, // Middleware to check if the length of the `newTask` property in the request body exceeds a maximum length (140 characters).
  enforceContentType, // Middleware used to enforce the content-type of the request(application/json)
  validateUsername //Middleware checks if the `newUsername` property exists in the request body and if it ends with '@gmail.com'.
      } = require('./middleware');
const router = express.Router();// Create an Express router which can be used to define routes for the application

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

// Protected route to retrieve tasks
router.get('/findTasks', authenticateToken, async (req, res) => {//Define the route for the HTTP request
  try {
   
    res.send(JSON.stringify(tasks));    // Respond with the list of tasks

  } 
  catch (error) {
    //Handle errors 
    console.error('Error fetching tasks', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 Internal Server Error status
  
}});



// Route for user login
router.post("/login", (req, res) => {//Define the route for the HTTP request
  
  const authHeader = req.headers['authorization'];// Extract the JWT token from the Authorization header
      const token = authHeader && authHeader.split(' ')[1];
  const { username, password } = req.body;//Extract the username and password from the request body
// Search for a user in the users array with matching username and password.
  const user = users.find(user => user.username === username && user.password === password);

  //Conditional rendering based on whether a user is found
  if (user) {
    // Generate a JWT token for authentication
    const jwtToken = jwt.sign(
      {
        username: user.username,//JWT payload
      },
      'secretKey',// secret key used to sign the JWT.
      {
        expiresIn: '1h', // Specify the time until the  JWT will expire  (1 hour).
        algorithm: 'HS256' //Specifies the signing algorithm used.
    }
    );
    res.json({ token: jwtToken });    // Respond with the generated JWT token

  } 
  else {  
    // If the user credentials are invalid , respond with a 401 Unauthorized status and a message
    res.status(401).json({ message: "User not Authenticated" });// Respond with an authentication failure message
  }
});


// Route to register a new user 
router.post('/register', validateUsername, (req, res, next) => {//Define the route for the HTTP request
  const { newUsername, newPassword } = req.body;  // Extract new username and password from the request body

  // Conditional rendering to check if both username and password are provided
  if (!newUsername || !newPassword) {
    // If not, respond with a 400 Bad Request status and an error message
    return res.status(400).json({ message: 'Username and password are required' });
  }
  else if (users.some((user) => user.username === newUsername)) {// Conditional rendering to check if the username is already taken
    /*The `array.some` method tests whether at least one element in the array passes the test impleted by the provided function.
 It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false.  */
    // If it is, respond with a 409 Conflict status and an error message
    return res.status(409).json({ message: 'Username is already taken' });
  }
  // If username is unique, create a new user object
  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);  // Add the new user to the 'users' array

  // Generate a JWT token for the newly registered user
  const token = jwt.sign(
    { username: newUser.username },//JWT payload
    'secretKey',// secret key used to sign the JWT.
    { expiresIn: '1h' }// Specify the time until the  JWT will expire  (1 hour).
  );

  res.json({ token });  // Respond with the generated JWT token

});

//Route to add a new Task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Define the route for the HTTP request
  try {
    const { newTask } = req.body;// Extract the new task name from the request body

    // Conditional rendering to check if the new task name is provided
    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });// respond with a 400 Bad Request status and an error message
    }
    else if (tasks.some((task) => task.title === newTask)) {// Conditional rendering  to check if the task title already exists
      return res.status(409).json({ message: 'Task title already exists' });//respond with a 409 Conflict status and an error message
    }
    else {
      // If the new task name is valid and unique, create a new task object
      const newTaskObject = {
        id: tasks.length + 1,
        title: newTask,
      };
      
      tasks.push(newTaskObject);      // Add the new task object to the existing 'tasks' array
      res.json(newTaskObject);// Respond with the details of the newly added task
    }
  } 
  catch (error) {
    console.error('Error adding task:', error.message);//Log an error message in the console
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500(Internal Server Error) response
  }
});

//Route to edit an existing task
router.put('/editTask/:id', authenticateToken, limitTaskLength, (req, res) => {//Define the route for the HTTP request
  const taskId = parseInt(req.params.id);  // Extract the task ID from the URL parameters

  const updatedTitle = req.body.value;// Extract the updated task title from the request body

  tasks = tasks.map((task) =>  // Update the 'tasks' array by mapping through each task
    task.id === taskId ? { ...task, title: updatedTitle } : task
  );
  // Respond with a 200 OK status and a success message and the updated task list
  res.status(200).json({ success: true, tasks });
});

//Route to delete a task
router.delete('/deleteTask/:id', authenticateToken, (req, res) => {//Define the route for the HTTP request
  try {
    const taskId = parseInt(req.params.id); // Extract the task ID from the URL parameters
    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);  // Find the index of the task to be deleted in the 'tasks' array

    
    // Conditional rendering to check if the task exists and the user has permission to delete it
    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
      // Respond with a 404 Not Found status and an error message
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    tasks.splice(taskToDeleteIndex, 1);    // Delete the specified task and respond with the updated task list


    res.status(200).json(tasks);    // Respond with a 200 OK status and the updated task list

  } catch (error) {
    console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Respond with a 500 Internal Server Error status
  }
});

module.exports = router;
