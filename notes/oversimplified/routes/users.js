const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const router = express.Router(); 
const cors = require('cors');

//Setup middleware
router.use(express.json());
router.use(cors()); 

//===============DATA==================
let users = [
  {
    id: '0',
    username: 'admin@gmail.com',
    password: 'passWord1', // Consider using hashing and salting for password storage
  },
  { 
    id: 1,
    username: 'user1@gmail.com',
    password: 'passWord2',
  },
];

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

function generateUniqueId() {
  const id = Math.floor(Math.random() * 1000);
  return id;
}

router.get('/', (req, res) => {
  res.json({
    route: '/',
    authentication: false,
  });
});

router.get('/findTasks', (req, res) => {
  try {
    const token = req.headers.token; // Access token from headers

    if (!token) {
      throw new Error('Token not provided');
    }

    const decoded = jwt.verify(token, 'secretKey');

    res.json({
      login: true,
      tasks: tasks.filter(task => task.user === decoded.username),
    });
  } catch (error) {
    console.error('Error occurred while fetching tasks:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      res.json({ login: false });
      return;
    }

    const jwtToken = jwt.sign({
      username: user.username,
      userId: user.id
    }, 'secretKey', {
      expiresIn: '12h',
      algorithm: 'HS256'
    });

    res.json({ login: true, token: jwtToken });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/register', (req, res) => {
  console.log('register user');
  console.log(req.body);
  try {
    const { newUsername, newPassword } = req.body; 

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    else if (users.some((user) => user.username === newUsername)) {
      return res.status(409).json({ message: 'Username is already taken' })
    }
    else{
      const newUserId = generateUniqueId();
      console.log(newUserId);

      const newUser = { id: newUserId, username: newUsername, password: newPassword };
      console.log(newUser);

      users.push(newUser);
      console.log(users);

    }

  } catch (error) {
    console.error('Error occurred while adding user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/addTask', (req, res) => {
  const { user, title } = req.body;

  if (!title || !user) {
    return res.status(400).json({ message: 'User and task name are required' });
  }

  if (tasks.some((task) => task.title === title && task.user === user)) {
    return res.status(409).json({ message: 'Task title already exists' });
  }

  const newTaskObject = { taskId: tasks.length + 1, title };

  tasks.push(newTaskObject);
  res.json(newTaskObject);
});

module.exports = router;
