// Import required libraries and middleware
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const { checkJwtToken } = require('./middleware');

//Setup middleware
router.use(express.json())
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
function generateUniqueId() {
  const id = Math.floor(Math.random() * 1000)
  return id
}

//===========ROUTES============
// Route to send a GET for the root endpoint '/'
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// Route to send a GET request to the '/findTasks' endpoint
router.get('/findTasks', (req, res) => {
  console.log(tasks);
  const taskId = req.query.taskId;

  if (taskId) {
    const task = tasks.find(task => task.id === parseInt(taskId));
    return task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
  }

  res.json(tasks);
})

//Route to send a POST request to the users/login endpoint
router.post('/login', (req, res) => {
  console.log('login');
  console.log(req.body);

  const { username, password } = req.body;

  // Find user in the users array
  const foundUser = users.find(user => user.username === username && user.password === password);

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

    res.json({ jwtToken });
  } else {
    console.error('Login Failed: User or password are incorrect');
    res.status(401).json({ message: 'User not authenticated' });
  }
});

//Route to send a POST request to the users/register endpoint
router.post('/register', (req, res) => {
  console.log('register');
  console.log(req.body);
  try {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' })
    } else if (!newUsername && !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' })
    }
    else if (
      users.find((user) => user.username === newUsername)
      /*users.some((user) => user.username === newUsername)*/
    ) {
      return res.status(409).json({ message: 'Username is already taken' })
    }
    else {
      const newUserId = generateUniqueId();
      console.log(newUserId);
      const newUser = { id: newUserId, username: newUsername, password: newPassword };
      console.log(newUser);
      users.push(newUser);
      res.json(newUser);
    }
  } catch (error) {
    console.error(`Error occured while adding user ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route for sending a POST request to users/addTask endpoint
router.post('/addTask', (req, res) => {
  console.log('task added');
  console.log(req.body);
  try {
    const { user, title } = req.body;

    if (!title || !user) {
      return res.status(400).json({ message: 'User and task name are required' });
    }
    else if (tasks.some((task) => task.title === title && task.user === user)) {
      return res.status(409).json({ message: 'Task title already exists' });
    }
    else {
      const newTaskObject = { taskId: tasks.length + 1, title };
      tasks.push(newTaskObject);
      res.json(newTaskObject);
    }

  } catch (error) {
    console.error('Error adding task', error.message);
    res.status(500).json({ message: 'Internal Server Error' })

  }
})

module.exports = router;
