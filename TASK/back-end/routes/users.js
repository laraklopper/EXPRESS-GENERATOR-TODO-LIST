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
const { checkJwtToken, validateUsername, validateTask, validateUpdatedTask} = require ('./middleware')

//==========MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
router.use(cors()); //Enable Cross-Origin Resource sharing 


//========ROUTES=============
// Route to handle GET requests to the base root path '/'
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Route to handle GET requests to fetch all tasks 
router.get('/findTasks',checkJwtToken, async(req, res) => {
  try {
    const tasks = await Task.find({})

    res.json({
          login: true, 
          tasks: tasks
        });
  } 
  catch (error) {
       console.error('Error fetching tasks', error.message);
       res.status(500).json({ message: 'Internal Server Error' });
  }
})


//Route to send a POST request to the login endpoint
router.post('/login', async (req, res) => {
  
  console.log('user login');
  console.log(req.body);  

  try {
    
    const { username, password } = req.body;  
    const user = await User.findOne({ username, password });
    console.log(user);
    
    if (user) {
      if (password === user.password) {
        const jwtToken = jwt.sign(
          {  userId: user._id},
          'secretKey',
          { expiresIn: '12h', algorithm: 'HS256' }
        )
        // Send the generated JWT token as a JSON response
        res.json(
          {'token': jwtToken});

      } else {
        throw new Error('Password incorrect');
      }
    }
    else {
      throw new Error('User not found');
    }
  }
  catch (error) {
    console.error('Login Failed: User or password are incorrect'); 
    res.status(401).json({ message: 'User not authenticated' }); 
  }
});


//Route to send a POST request the register endpoint
router.post('/register', validateUsername, async(req, res) => {
  //Debugging
  console.log(req.body);
  console.log('user register'); 
  try {
    // Extract the username and password from the request body
    const { username, password } = req.body; 

    if (!username || !password) {
      return res.status(400).json(
        { message: 'Username and password are required' }
        );
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json(
        { message: 'Username already exists' }
      );
    }
   
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();// Save the new user to the database

    res.status(201).json({ message: 'User successfully created', result: savedUser });
    
  } 
  catch (error) {
    console.error(`Error occurred while adding user: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})


//Route to send a POST request to the /addTask endpoint
router.post('/addTask', validateTask, async (req, res) => {
  // Debugging
  console.log(req.body);
  console.log('add Task');
  try {
    const { user, title } = req.body;

    if (!user || !title) {
      // If either is missing, send a 400 Bad Request response with an error message
      return res.status(400).json(
        { message: 'User and title are required' }
        );
    }

    const existingTask = await Task.findOne({ user, title });
    if (existingTask) {
      return res.status(409).json(
        { message: 'Task title already exists for this user' }
        );
    }
    
    const newTask = new Task({ user, title });
    await newTask.save();

    console.log(newTask);
    return res.status(201).json(newTask);

  } 
  catch (error) {
    console.error(`Error occurred while adding task: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to send a PUT request to the edit task endpoint
router.put('/editTask/:_id', validateUpdatedTask, async (req, res) => {

  console.log(req.body);
  console.log('editing task');  
  try {
    // Extract the _id from request parameters and newUser, newTitle from request body
    const { _id } = req.params;//Request parameters
    const { newUser, newTitle } = req.body;//Request body

    // Create an empty object to store update information
    const updateObject = {};
    if (newUser) updateObject.user = newUser;  
    if (newTitle) updateObject.title = newTitle;  

    // Find the task by its ID and update it with the fields specified in the updateObject
    const updatedTask = await Task.findByIdAndUpdate(
      _id,// The ID of the task to update
      updateObject, // The object containing the fields to update and their new values
      { new: true }// Return the updated task after the update operation
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Updated Task:', updatedTask);
    res.status(201).json({ message: 'Task successfully updated', updatedTask });

  } 
  catch (error) {
    console.error(`Error editing task ${error.message}`);
    res.status(500).json({ message: 'Internal server Error' });
  }

})

// Route to send a DELETE request to the deleteTask task endpoint
router.delete('/deleteTask/:taskId', async(req, res) => {
  try {
    const taskId = req.params.taskId;
    
    const removedTask = await Task.findByIdAndDelete(taskId);

    if (!removedTask) {
      return res.status(404).json({error : 'Task not found'})
    }
  
  res.json({ 
    message: 'Task successfully deleted',
    deletedTaskId: removedTask.id 
  })
} 
  catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

module.exports = router;// Export the router to be used in other parts of the application
