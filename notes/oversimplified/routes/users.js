const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors())
router.use(express.json())

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

//===========FUNCTIONS===================

function generateUniqueId() {
  const id = Math.floor(Math.random()*1000)
  return id
}

//=========ROUTES============

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route to send a GET request to the '/findTasks' endpoint
router.get('/findTasks', (req, res) => {
  const taskId = req.query.id;

  if (taskId) {
    const tasks = tasks.find(task => task.id === parseInt({taskId}))
    return task ? res.json : res.status(404).json({message: 'Task Not Found'});
  }

  res.json({tasks})
})

// Route to send a GET request to the '/findTasks' endpoint
router.post('/login', (req, res) => {
  console.log('User Login');
  console.log(req.body);
  try {

    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      res.json({ login: false });
      return;
    }
    else{
      const jwtToken = jwt.sign({
        username: user.username,
        userId: user.id
      }, 'secretKey', {
        expiresIn: '12h',
        algorithm: 'HS256'
      });

      res.json({ login: true, token: jwtToken });
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

//Route to send a POST request to the users/register endpoint
router.post('/register', (req, res) => {
  console.log('Register User');
  console.log(req.body);
  try {
    const {newUsername, newPassword} = req.body;

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    else if (users.find((user) => user.username === newUsername)) {
      return res.status(409).json({ message: 'Username is already taken' });
    }
    else{
      const newUserId = generateUniqueId(); 
      const newUser = { id: newUserId, username: newUsername, password: newPassword };
      users.push(newUser)
      console.log(newUserId);
      console.log(users)
    }

  } catch (error) {
    console.error('Error occurred while adding user:', error);
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Route for sending a POST request to users/addTask endpoint
router.post('/addTask', (req, res) => {
  console.log('task added');
  console.log(req.body);
  try {
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
  } catch (error) {
    console.error('Error occurred adding task:', error);
    return res.status(500).json({ message: 'Internal Server Error' })
  }
  
});

module.exports = router;
