const express = require('express');
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const router = express.Router();
const {
  authenticateToken,// Middleware function to authenticate a JWT token from the 'Authorization' header
  checkJwtToken,
  validateUsername,
  limitTaskLength,
  enforceContentType,
  limitUpdatedTaskLength,
  authenticateUser,
} = require('./middleware');

router.use(express.json());

//Sample Data
const users = [
  {
    username: 'user1@gmail.com',
    userId: '0',
    password: 'passWord1',
  },
  {
    username: 'user2@gmail.com',
    userId: 1,
    password: 'passWord2',
  },
];

let tasks = [
  {
    user: 'user1@gmail.com',
    userId: 0,
    title: 'Task1',
  },
  {
    user: 'user2@gmail.com',
    userId: 1,
    title: 'Task2',
  },
];



//===========ROUTES=================
router.get('/', (req, res) => {
  res.redirect('/login')
})

// Route to send a GET requestt to the '/findTasks' endpoint
router.get('/findTasks', authenticateToken, (req, res) => {
    try {
        const userTasks = tasks.filter((task) => task.userId === req.user.userId);

        if (userTasks.length > 0) {
            res.json({
                login: true,
                userTasks: req.user,
                tasks: tasks
            });
        } else {
            res.status(401).json({
                login: false,
                message: 'Invalid Token',
            });
        }
        console.log('Tasks:', userTasks);

    } catch (error) {
        console.error('Error finding tasks:', error);
        res.status(500).json('Internal server error');
    }
});

//Protected route for userLogin
router.post("/login", authenticateUser, (req, res) => {//Route for the HTTP request
  const { username, password } = req.body;//Extract the username and password from the request body

  // Find a user in the 'users' array whose username and password match the provided credentials
  const user = users.find(user => user.username === username && user.password === password);

  // Conditional renderting to check if a user with the provided credentials is found
  if (user) {
    // If user is found, generate a JWT token using the 'jwt.sign' method
    const jwtToken = jwt.sign(
      {
        username: user.username, userId: user.userId // Payload of the JWT token includes the username
      },
      'userLoginSecretKey',    // Secret key used to sign the JWT token
      {
        expiresIn: '1h',         // Token expiration time set to 1 hour
        algorithm: 'HS256'       // Algorithm used for signing the JWT token
      }
    );

    // Respond with  a JSON object containing the generated JWT token
    
    res.json({ token: jwtToken});
  } else {
    // If no user is found with the provided credentials, log an error and respond with a 401 status
    console.error('Login failed');//Display an error message in the console for debugging purposes
    res.status(401).json({ message: "User not Authenticated" });//Respond with a 401 Unauthorized status and a JSON object containing an error message 
  }
});


// Route to register a new user
router.post('/register',validateUsername, (req, res) => {//Route for the HTTP request
  try {
    const { newUsername, newPassword } = req.body;//Extract the newUsername and newPassword from the request body

    // Conditional rendering to check if the newUsername or newPassword is missing
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });// If either are missing, respond with a 400 Bad Request status and an error message
    }
    else if (users.find((user) => user.username === newUsername)) {//Conditional rendering to check if the newUsername already exists in the 'users' array

      // If it exists, respond with a 409 Conflict status and an error message
      return res.status(409).json({ message: 'Username is already taken' });
    }

    // If newUsername is unique, create a new user object
    const newUser = { username: newUsername, password: newPassword };

    // Add the new user to the 'users' array
    users.push(newUser);
    console.log(newUser); //Log the newUser to the console
    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { username: newUser.username },  // Payload of the JWT token includes the username
      'newUserSecretKey',              // Secret key used to sign the JWT token
      { expiresIn: '1h' }               // Specify the time until the JWT token will expire  (1 hour).
    );

    // Respond with a JSON object containing the generated JWT token
    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error.message); // Log an error message in the console for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
    /* Respond with a 500 Internal Server Error status code and a JSON object error message in case of an error*/
  }
});

//Route to add a new Task "/addTask" endpoint
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Route for the HTTP request
  try {
    const { newTask } = req.body;//Extract the newTask from the request body

    // Conditional rendering to check if newTask is missing
    if (!newTask) {
      // If newTask is missing, respond with a 400 Bad Request status and an error message
      return res.status(400).json({ message: 'Task name is required' });
    }
    else if (tasks.some((task) => task.title === newTask)) {// Conditional rendering to check if the newTask title already exists in the 'tasks' array

      // If the task exists, respond with a 409 Conflict status and an error message
      return res.status(409).json({ message: 'Task title already exists' });
    }
    else {
      // If newTask is unique, create a new task object
      const newTaskObject = {
        id: tasks.length + 1,  // Generate a unique ID for the new task
        title: newTask,        // Set the title of the new task
      };


      tasks.push(newTaskObject);// Add the new task object to the 'tasks' array
      res.json(newTaskObject);// Respond with a JSON object containing the new task details

    }
  }
  catch (error) {
    console.error('Error adding task:', error.message);// Log an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });// Respond with a 500 Internal Server Error status code and an error message
  }
});

// Route for handling PUT requests to "/editTask/:id"
router.put('/editTask/:taskId', limitUpdatedTaskLength, (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId)// Extract the task ID from the request parameters and convert it to an integer
    const updatedTitle = req.body.value;

    tasks = tasks.map((task) => task.id === taskId ? { ...task, title: updatedTitle } : task);


    res.status(200).json({success: true, tasks})
  } catch (error) {
    console.error('Error editing tasks', error.message);//Log an error message in the console for deb
    res.status(500).json({message: 'Internal Server Error'})
  }
})
// Route for handling DELETE requests to "/deleteTask/:id"
router.delete('/deleteTask/:taskId', authenticateToken, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);// Extract the task ID from the request parameters and convert it to an integer

    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);// Find the index of the task to delete in the 'tasks' array

    // Conditional rendering to check if the task to delete is not found or the user does not have permission
    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
      // Respond with a 404 Not Found status and an error message
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    // If the task is found and the user has permission, remove the task from the 'tasks' array
    tasks.splice(taskToDeleteIndex, 1);

    // Respond with a 200 OK status and the updated 'tasks' array
    res.status(200).json(tasks);
  } 
  catch (error) {
    console.error('Error deleting task:', error.message);// Log an error message in the console for debugging purposes

    res.status(500).json({ message: 'Internal Server Error' });// Respond with a 500 Internal Server Error status code and an error message

  }
});

module.exports = router;//Export the router to make it available in other parts of the application
