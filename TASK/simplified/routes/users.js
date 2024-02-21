// Import required libraries and middleware
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cors = require('cors');
// const { 
//   checkJwtToken, 
//   validateUsername, 
//   limitTaskLength, 
//   enforceContentType } 
//   = require('./middleware');

// Middleware to parse JSON bodies
router.use(express.json());
router.use(cors())

//===========DATA==================
//----------USER DATA---------------------
//In-memory array used to store the data
let users = [
  {
    id: '0',
    username: 'admin@gmail.com',
    password: 'passWord1',
  },
  { 
    id: 1,
    username: 'user1@gmail.com',
    password: 'passWord2',
  },
];

//----------TASKS DATA---------------------------
// In-memory array used to store the data
let tasks = [
  {
    id: 0,
    user: "admin@gmail.com",
    title: "Implement a Post route for logging in",
  },
  {
    id: 1,
    user: "user1@gmail.com",
    title: "Implement custom middleware to authenticate user",
  },
];
// Route to send a GET for the root endpoint '/'
router.get('/', (req, res, next) => {
  res.send('Respond with resource');
});


// Route to send a GET request to the '/findTasks' endpoint
router.get('/findTasks', /*checkJwtToken,*/ (req, res) => {
  const taskId = req.query.taskId;

  if (taskId) {
    const task = tasks.find(task => task.id === parseInt(taskId));
    return task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
  } 

  res.json(tasks)
});

//Route to send a POST request to the users/login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  let foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    const jwtToken = jwt.sign({ 
      username: foundUser.username, 
      userId: foundUser.id
    }, 
      'secretKey', 
      { expiresIn: '12h', 
      algorithm: 'HS256' 
    });
    res.json({ token: jwtToken });
  } 
  
  else {
    console.error('Login failed');
    res.status(401).json({ message: "User not Authenticated" });
  }
});

//Route to send a POST request to the users/register endpoint
router.post('/register', /*validateUsername,*/ (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    else if (users.find((user) => user.username === newUsername)) {
      return res.status(409).json({ message: 'Username is already taken' })
    }
    else{
      // const newUserId = generateUniqueId(); 
      const newUser = { /*id: newUserId,*/ username: newUsername, password: newPassword };

      console.log(newUser);

      const token = jwt.sign(
        { username: newUser.username },
        'secretKey',
        { expiresIn: '12h' });

      users.push(newUser); 

      res.status(200).json({ token });
      console.log(users);

    }

  } catch (error) {
    console.error('Error occurred while adding user:', error);
    return res.status(500).json({message: 'Internal Server Error'})
  }
});

// Route for sending a POST request to users/addTask endpoint
router.post('/addTask',/*limitTaskLength, enforceContentType, */  (req, res) => {
  const { user, title } = req.body;
  
  if(!title || !user) {
    return res.status(400).json({ message: 'User and task name are required' });
  }
  
  if (tasks.some((task) => task.title === title && task.user === user)) {
    return res.status(409).json({ message: 'Task title already exists' });
  }
  
  const newTaskObject = { taskId: tasks.length + 1, title };
    tasks.push(newTaskObject);
    res.json(newTaskObject);

});


module.exports = router;//Export the router to make it available in other parts of the application
