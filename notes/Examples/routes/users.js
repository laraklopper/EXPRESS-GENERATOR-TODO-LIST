const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticationToken, limitTaskLength, enforceContentType, validateUsername } = require('./middleware');

router.use(express.json());

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

// router.get('/findTasks', authenticateToken, (res, req) => {
//   try {
//     res.json(JSON.stringify(tasks))
//     console.log(JSON.stringify(tasks));
//   } catch (error) {
//     console.error('Error finding tasks,')
//     res.status(500).json('Internal server error')
//   }
// })


router.get('/findTasks', authenticationToken, (req, res) => {
  try {
    res.json({
      login: true,
      data: req.user,
      tasks: tasks,
    });
  } catch (error) {
    res.status(401).json({
      login: false,
      message: 'Invalid Token',
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    const jwtToken = jwt.sign(
      {
        username: user.username,
      },
      'userLoginSecretKey',
      {
        expiresIn: '12h',
        algorithm: 'HS256',
      }
    );

    res.json({ token: jwtToken });
  } else {
    console.error('Login Failed');
    res.status(401).json({ message: 'User not Authenticated' });
  }
});

router.post('/register', validateUsername, (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    } else if (users.find((user) => user.username === newUsername)) {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    const newUser = { username: newUsername, password: newPassword };
    users.push(newUser);

    const token = jwt.sign(
      { username: newUser.username },
      'newUserSecretKey',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
  try {
    const { newTask } = req.body;

    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });
    } else if (tasks.some((task) => task.title === newTask)) {
      return res.status(409).json({ message: 'Task title already exists' });
    } else {
      const newTaskObject = {
        id: tasks.length + 1,
        title: newTask,
      };

      tasks.push(newTaskObject);
      res.json(newTaskObject);
    }
  } catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
