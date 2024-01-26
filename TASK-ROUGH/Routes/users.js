const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
import { 
  authenticationToken, 
  validateUsername, 
  limitTaskLength, 
  enforceContentType } from './middleware';

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

//=============ROUTES===============
//----------------GET REQUEST------------------
// Protected route to retrieve tasks
router.get('/findTasks', authenticationToken, (req, res) => {
  try {
    res.send(JSON.stringify(tasks))
  } catch (error) {
    console.error('Error fetching tasks', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//----------------------POST REQUEST----------------------------
// Route for user login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password)

    if (user) {
      const jwtToken = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
      res.json({ jwtToken });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login Failed', error);
    res.status(401).json({ message: "User not Authenticated" });
  }
});

// Route to register a new user 
router.post('/register', validateUsername, (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    } else if (users.some((user) => user.username === newUsername)) {
      return res.status(409).json({ message: 'Username is already taken' });
    } else {
      const newUser = { username: newUsername, password: newPassword };
      users.push(newUser);

      const token = jwt.sign({ username: newUser.username }, 'newUserSecretKey', { expiresIn: '1h' });
      res.json({ token });
    }
  } catch (error) {
    console.error('Error adding newUser', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Route to add a new Task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
  try {
    const { newTask } = req.body;

    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });
    } else if (tasks.some((task) => task.title === newTask)) {
      return res.status(409).json({ message: 'Task title already exists' });
    } else {
      const newTaskObject = { id: tasks.length + 1, title: newTask };
      tasks.push(newTaskObject);
      res.json(newTaskObject);
    }
  } catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//----------------PUT REQUEST---------------------
//Route to edit an existing task
router.put('/editTask/:id', authenticateToken, limitTaskLength, (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTitle = req.body.value;

  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, title: updatedTitle } : task
  );

  res.status(200).json({ success: true, tasks });
});

//--------DELETE REQUEST----------------
//Route to delete a task
router.delete('/deleteTask/:id', authenticateToken, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    tasks.splice(taskToDeleteIndex, 1);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;//Export the router to make it available in other parts of the application
