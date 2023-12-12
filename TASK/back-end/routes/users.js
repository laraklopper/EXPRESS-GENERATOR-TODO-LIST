const express = require('express');//Import the Express framework for creating the server and handling routes
const jwt = require('jsonwebtoken');//Import jsonwebtoken for generating and verifying JSON Web Tokens (JWT).
// Create an Express router which can be used to define a route for the application.
const router = express.Router();

//----------Sample Data-----------------
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
    username: "user1@gmail.com",
    id: 1,
    title: 'Task1',
  },
  {
    username: "user2@gmail.co.za",
    id: 2,
    title: 'Task2',
  },
];

// -----Protected route to retrieve tasks which requires a valid JWT token------
router.get('/findTasks', function (req, res) {
  try {
    setTimeout(() => {
      res.json(tasks);
    }, 1000);
  } catch (error) {
    console.error('Error fetching tasks', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//-------- Route for user login-----------------
router.post("/login", function (req, res) {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    const jwtToken = jwt.sign(
      {
        username: user.username,
        password: user.password,
      },
      'secretKey',
      { expiresIn: '1h' } 
    );

    res.json({ "token": jwtToken });
  } else {
    res.status(401).json({ message: "User not Authenticated" });
  }
});



//-----------Route to register a new user-------------------------
router.post('/register', (req, res, next) => {
  const { newUsername, newPassword } = req.body;

  if (!newUsername || !newPassword) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (users.some((user) => user.username === newUsername)) {
    return res.status(409).json({ message: 'Username is already taken' });
  }

  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);

  const token = jwt.sign(
    { username: newUser.username },
    'secretKey',
    { expiresIn: '1h' }
  );

  res.json({ token });
});


//---------Route for adding a newTask-------------
router.post('/addTask', (req, res) => {
  try {
    const { newTask } = req.body;

    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    if (tasks.some((task) => task.title === newTask)) {
      return res.status(409).json({ message: 'Task title already exists' });
    }

    const newTaskObject = {
      id: tasks.length + 1,
      title: newTask,
    };

    tasks.push(newTaskObject);
    res.json(newTaskObject);

  } catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//------------Edit task route-------------------

router.put('/editTask/:id', (req, res) => {
  // Extract task ID and updated value from the request parameters and body
  const taskId = parseInt(req.params.id);
  const updatedValue = req.body.value;

  // Update the tasks array with the edited task
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, value: updatedValue } : task
  );

  res.status(200).json({ success: true, tasks }); // Respond with success and the updated tasks array
});


//---------Route to delet a task---------------
router.delete('/deleteTask/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  tasks = tasks.filter((task) => task.id !== taskId);

  res.status(200).json(tasks);
});
module.exports = router;
