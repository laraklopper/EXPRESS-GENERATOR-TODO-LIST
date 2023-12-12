const express = require('express');// Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');// Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT)
const { authenticateToken, limitTaskLength, enforceContentType } = require('./middleware');// Import middleware functions for token checking and authentication
// Create an Express router which can be used to define routes for the application
const router = express.Router();

// Sample data for users and tasks
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
    username: 'user2@gmail.co.za',
    id: 2,
    title: 'Task2',
  },
];

// Protected route to retrieve tasks which requires a valid JWT token
router.get('/findTasks', authenticateToken, (req, res) => {
  // Middleware checks if a valid JWT token is present in the request headers.
  try {
    // Simulating an asynchronous operation (e.g., fetching tasks from a database)
    setTimeout(() => {
      res.json(tasks); // After the simulated asynchronous operation, the route responds with a JSON array containing the tasks 
    }, 1000);
  } catch (error) {
    // Handle errors that may occur during the request 
    console.error('Error fetching tasks', error.message); // Display an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route for user login with token authentication
router.post("/login", authenticateToken, (req, res) => {
  // Middleware checks if a valid JWT token is present in the request headers
  const { username, password } = req.body; // Extract the username and password from the request body
  // Find the user with the provided username and password in the users array
  const user = users.find(user => user.username === username && user.password === password);

  // Conditional rendering to check if a matching user is found
  if (user) {
    // Generate a new JWT token for the authenticated user
    const jwtToken = jwt.sign(
      {
        username: user.username,
        password: user.password,
      },
      'secretKey', // Secret Key
      { expiresIn: '1h' }
    );
    res.json({ "token": jwtToken });    // Respond with the generated token

  } else {
    /*If no matching user is found (authentication fails), the route responds with a 401 Unauthorized status and a 
    message indicating that the user is not authenticated*/
    res.status(401).json({ message: "User not Authenticated" });
  }
});

// Route to register a new user
router.post('/register', (req, res, next) => {
  const { newUsername, newPassword } = req.body;

  // Conditional rendering to validate username and password
  if (!newUsername || !newPassword) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Conditional renderigng to check if the username is already taken
  if (users.some((user) => user.username === newUsername)) {
    return res.status(409).json({ message: 'Username is already taken' });
  }

  // Add the new user to the users array
  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);

  // Generate a JWT token for the new user
  const token = jwt.sign(
    { username: newUser.username },
    'secretKey',
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Route for adding a new task with custom middlewares to limit the task length and enforce content type
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
  try {
    const { newTask } = req.body;
    
    // Conditional rendering
    if (!newTask) { // Check if the task name is provided
      return res.status(400).json({ message: 'Task name is required' });
    } 
    else if (tasks.some((task) => task.title === newTask)) { // Check if the task title already exists
      return res.status(409).json({ message: 'Task title already exists' });
    } 
    else {
      // Add the new task to the tasks array
      const newTaskObject = {
        id: tasks.length + 1,
        title: newTask,
      };
      tasks.push(newTaskObject);
      res.json(newTaskObject);
    }

  } catch (error) {
    console.error('Error adding task:', error.message); // Display an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route for editing a task
router.put('/editTask/:id', authenticateToken, limitTaskLength, (req, res) => {
  // Extract task ID and updated value from the request parameters and body
  const taskId = parseInt(req.params.id);
  const updatedTitle = req.body.value;

  // Update the tasks array with the edited task
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, title: updatedTitle } : task
  );

  // Respond with success and the updated tasks array
  res.status(200).json({ success: true, tasks });
});

// Route to delete a task
router.delete('/deleteTask/:id', authenticateToken, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);// Extract the task ID from the parameters of the incoming HTTP request.
   /* - req.params.id: Access the value of the id parameter in the route.
      - parseInt(req.params.id): Convert the value to an integer.*/

    // Check if the task with the specified ID belongs to the authenticated user
    const taskToDelete = tasks.find((task) => task.id === taskId && task.username === req.user.username);

    // Conditional rendering to check if a task belongs to a specific user
    if (!taskToDelete) {
      // If the task doesn't belong to the user, respond with a 404 Not Found status
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    // Filter out the task with the specified ID
    tasks = tasks.filter((task) => task.id !== taskId);

    
    res.status(200).json(tasks);// Respond with the updated tasks array
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Exporting the router for use in other parts of the application
module.exports = router;
