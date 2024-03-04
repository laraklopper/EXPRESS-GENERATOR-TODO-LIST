// Import required libraries and middleware
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');

//Setup middleware
router.use(express.json());
router.use(cors());

//----------USER DATA---------------------
// In-memory array used to store the data
let users = [
  {
    username: 'admin@gmail.com',
    id: '0',
    password: 'password1',
  },
  {
    username: 'user1@gmail.com',
    id: 1,
    password: 'password2',
  },
];

//----------TASKS DATA---------------------------
// In-memory array used to store the data
let tasks = [
  {
    user: "admin@gmail.com",
    id: 0,
    title: "Implement a Post route for logging in",
  },
  {
    user: "user1@gmail.com",
    id: 1,
    title: "Implement custom middleware to authenticate user",
  },
];

//==========Function to generate unique ID===========
//Function to generate unique ID
function generateUniqueId() {
  // Math.random() generates a random number between 0 (inclusive) and 1 (exclusive).
  // Multiplying it by 1000 gives a random number between 0 (inclusive) and 1000 (exclusive).
  // Math.floor() rounds down the number to the nearest integer, ensuring it's an integer value.
  const id = Math.floor(Math.random() * 1000);
  
  // Return the generated unique identifier.
  return id;
}


//===========ROUTES============
// Route to send a GET for the root endpoint '/'
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// Route to send a GET request to the '/findTasks' endpoint
router.get('/findTasks', (req, res) => {
  console.log(tasks); // Log the tasks array to the console
  const taskId = req.query.taskId; // Extract the taskId parameter from the query string

  // Conditional rendering to check if taskId is provided in the query string
  if (taskId) { 
    // Find the task in the tasks array that matches the provided taskId
    const task = tasks.find(task => task.id === parseInt(taskId));
    // If task is found, respond with the task, otherwise respond with 404 error
    return task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(tasks);// If no taskId is provided, respond with the entire tasks array
})


//Route to send a POST request to the users/login endpoint
router.post('/login', (req, res) => {
  console.log('login');// Log to console indicating that login process has started
  console.log(req.body);// Log the request body, which should contain the username and password
  try {
    const { username, password } = req.body;// Extract username and password from request body

     // const foundUser = users.find(user => user.username === username && user.password === password);
    let foundUser = null; // Initialise a variable to store the found user

      // Loop through the users array to find a user with matching username and password
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        foundUser = users[i];
        break;// If found, assign the user to foundUser variable and break the loop
      };     
    }

    if (foundUser) {
      // If user found, generate JWT token
      const jwtToken = jwt.sign(
        {
          id: foundUser.id,
          username: foundUser.username,
        },
        'secretKey',
        { expiresIn: '12h' }
      );

      res.json({ jwtToken });// Respond with the generated JWT token
    } else {
       // If user not found or credentials are incorrect, log an error and respond with 401 Unauthorized status
      console.error('Login Failed: User or password are incorrect');
      res.status(401).json({ message: 'User not authenticated' });
    }

  } catch (error) {
    // Catch any errors that occur during the login process and respond with 401 Unauthorized status
    console.error('Login Failed: User or password are incorrect', error); 
    res.status(401).json({ message: 'User not authenticated' });
  }
});

//Route to send a POST request to the users/register endpoint
router.post('/register', (req, res) => {
  console.log('register'); // Log to console indicating that registration process has started
  console.log(req.body); // Log the request body, which should contain the new username and password
  
  try {
    const { newUsername, newPassword } = req.body; // Extract new username and password from request body

    // Check if new username or password is missing
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    } 

    // Check if both username and password are empty strings
    else if (!newUsername && !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the new username already exists in the users array
    else if (users.find((user) => user.username === newUsername)
            /*users.some((user) => user.username === newUsername)*/) 
    {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    // If all checks pass, proceed with user registration
    else {
      const newUserId = generateUniqueId(); // Generate a unique ID for the new user
      console.log(newUserId);
      const newUser = { id: newUserId, username: newUsername, password: newPassword }; // Create a new user object
      console.log(newUser);
      users.push(newUser); // Add the new user to the users array
      res.json(newUser); // Respond with the details of the newly registered user
    }
  } catch (error) {
    // Catch any errors that occur during the registration process and respond with 500 Internal Server Error status
    console.error(`Error occurred while adding user ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route for sending a POST request to users/addTask endpoint
router.post('/addTask', (req, res) => {
  console.log('task added'); // Log to console indicating that task addition process has started
  console.log(req.body); // Log the request body, which should contain the user and task title
  
  try {
    const { user, title } = req.body; // Extract user and task title from request body

    //  Conditional rendering to check if either user or task title is missing
    if (!title || !user) {
      return res.status(400).json({ message: 'User and task name are required' });
    }

    // Conditional rendering to check if the task title already exists for the given user
    else if (tasks.some((task) => task.title === title && task.user === user)) {
      return res.status(409).json({ message: 'Task title already exists' });
    }
    // If all checks pass, proceed with adding the new task
    else {
      const newTaskId = generateUniqueId(); // Generate a unique ID for the new task
      const newTaskObject = { id: newTaskId, title }; // Create a new task object
      // const newTaskObject = { taskId: tasks.length + 1, title };
      tasks.push(newTaskObject); // Add the new task to the tasks array
      res.json(newTaskObject); // Respond with the details of the newly added task
    }

  } catch (error) {
    // Catch any errors that occur during the task addition process and respond with 500 Internal Server Error status
    console.error('Error adding task', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Export the router to make it available in other parts of the application
module.exports = router;
