// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router(); // Create an Express router
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken'); 
//Schemas
const User = require('../models/userModel'); // Import the User model
const Task = require('../models/taskModel'); // Import the Task model
const cors = require('cors'); //Import Cross-Origin Resource Sharing middleware
//Import custom middleware
const { validateUsername, validateTask, validateUpdatedTask ,checkJwtToken } = require ('./middleware')

//==========MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
router.use(cors()); //Enable Cross-Origin Resource sharing 


//========ROUTES=============
// Route to handle GET requests to the base root path '/' to get users from database
// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.find({})

//     console.log(users);
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users', error.message);
//     res.status(500).json({ message: 'Internal server Error' })
//   }
// });


// Route to handle GET requests to fetch all tasks 
router.get('/findTasks', checkJwtToken, async(req, res) => {
  try {
    const tasks = await Task.find({})// Fetch all tasks from the database

    // Send a JSON response containing fetched tasks
    res.json({
          login: true, // Indicates successful login
          tasks: tasks // Send the fetched tasks
        });
  } 
  catch (error) {
    console.error('Error fetching tasks', error.message);// Log error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });// Send 500 status code and error message in JSON response
  }
})


//Route to send a POST request to the login endpoint
router.post('/login', async (req, res) => {
  
  console.log('user login');// Log a message in the console indicating user login for debugging purposes
  console.log(req.body); // Log the request body containing the username and password

  try {
    
    const { username, password } = req.body;  // Extract username and password from the request body
    const user = await User.findOne({ username, password });// Find the user in the database by username and password
    console.log(user); // Log the user details in the console for debugging purposes
    
    //Conditional rendering to check if the user is found
    if (user) {
      // Conditional rendering to check if the provided password matches the user's password
      if (password === user.password) {
        // Generate a JWT token for authentication
        const jwtToken = jwt.sign(
          {  userId: user._id},//Payload containing userId
          'secretKey',// Secret key for signing the token
          { expiresIn: '12h', algorithm: 'HS256' }// Token expiration time and algorithm
        )
        // Send the generated JWT token as a JSON response
        res.json(
          {'token': jwtToken});

      } else {
        throw new Error('Password incorrect');// Throw error if password is incorrect
      }
    }
    else {
      throw new Error('User not found'); // Throw error if user is not found
    }
  }
  catch (error) {
    console.error('Login Failed: User or password are incorrect'); //Log an error message in the console for debugging purposes
    res.status(401).json({ message: 'User not authenticated' });  // Send a 401 (Unauthorized) status code and error message in JSON respons
  }
});


//Route to send a POST request the register endpoint
router.post('/register', validateUsername, async(req, res) => {
  console.log(req.body);
  console.log('user register'); 
  try {
    // Extract the username and password from the request body
    const { username, password } = req.body; 

    // Check if username or password is missing
    if (!username || !password) {
      console.error('Username and password are required');//Log an error message in the console for debugging purposes
      // If either is missing, send a 400 Bad Request response with an error message
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Conditional rendering to check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json(
        { message: 'Username already exists' }
      );
    }
    const newUser = new User({ username, password });// Create a new user object with the provided username and password
    const savedUser = await newUser.save();// Save the new user to the database

    // Send a 201 Created response with a success message and the saved user object
    res.status(201).json({ message: 'User successfully created', result: savedUser });
    
  } 
  catch (error) {
    console.error(`Error occurred while adding user: ${error.message}`);//Log an error message in the console for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });// Send 500 status code and error message in JSON response
  }
})


//Route to send a POST request to the /addTask endpoint
router.post('/addTask', validateTask,  async (req, res) => {
  console.log(req.body);// Log the request body in the console
  console.log('add Task');//Log a message in the console indicating that a task is being added
  try {
    const { user, title } = req.body;// Extract the user and title from the request body

    // Conditional rendering if user or title is missing
    if (!user || !title) {
      // If either is missing, send a 400 Bad Request response with an error message
      return res.status(400).json({ message: 'User and title are required' });
    }

    // Conditional rendering to check if a task with the provided user and title already exists
    const existingTask = await Task.findOne({ user, title });
    if (existingTask) {
      // If task already exists, send a 409 Conflict response with an error message
      return res.status(409).json({ message: 'Task title already exists for this user' });
    }
    

    const newTask = new Task({ user, title });// Create a new task object with the provided user and title
    await newTask.save();// Save the new task to the database

    console.log(newTask);//Log the newTask in the console for debugging purposes
    return res.status(201).json(newTask);// Send a 201 Created response with the newly created task object

  } 
  catch (error) {
    console.error(`Error occurred while adding task: ${error.message}`);// Log the error message in the console for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' })// Send a 500 Internal Server Error response
  }
});


// Route to send a PUT request to the edit task endpoint
router.put('/editTask/:_id', validateUpdatedTask, async (req, res) => {

  console.log(req.body);// Log the request body in the console
  console.log('add Task');//Log a message in the console indicating that a task is being added
  try {
    // Extract the _id from request parameters and newUser, newTitle from request body
    const { _id } = req.params;//Request parameters
    const { newUser, newTitle } = req.body;//Request body

    // Create an empty object to store update information
    const updateObject = {};
    // Conditional rendering if the newUser or newTitle fields exist in the request body
    if (newUser) updateObject.user = newUser;  // If newUser exists, assign its value to the user field in the updateObject
    if (newTitle) updateObject.title = newTitle;  // If newTitle exists, assign its value to the title field in the updateObject

    // Find the task by its ID and update it with the fields specified in the updateObject
    const updatedTask = await Task.findByIdAndUpdate(
      _id,// The ID of the task to update
      updateObject, // The object containing the fields to update and their new values
      { new: true }// Return the updated task after the update operation
    );

    if (!updatedTask) {
      console.error('Task not found');// Log the error message in the console for debugging purposes
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log('Updated Task:', updatedTask); //Log the updated task in the console for debugging purposes
    // Send a 201 Created response with a success message and the updated task
    res.status(201).json({ message: 'Task successfully updated', updatedTask });

  } 
  catch (error) {
    console.error(`Error editing task ${error.message}`);// Log the error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal server Error' });// Send a 500 Internal Server Error response with an error message
  }

})

// Route to send a DELETE request to the deleteTask task endpoint
router.delete('/deleteTask/:taskId', async(req, res) => {
  try {
    const taskId = req.params.taskId;// Extract the task ID from the request parameters

    const removedTask = await Task.findByIdAndDelete(taskId);// Find and delete the task by ID

    //Conditional rendering to check if the removed task is found in the databas
    if (!removedTask) {
      // If the task is not found, return a 404 Not Found response with an error message
      return res.status(404).json({error : 'Task not found'})
    }
  
  res.json({ // Send a JSON response back to the client.
    message: 'Task successfully deleted',// Message indicating that the task was successfully deleted
    deletedTaskId: removedTask.id // The ID of the deleted task.
  })
} 
  catch (error) {
    console.error('Error deleting task:', error.message);// Log the error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });// Send a 500 Internal Server Error response with an error message
  }
})

module.exports = router;// Export the router to be used in other parts of the application
