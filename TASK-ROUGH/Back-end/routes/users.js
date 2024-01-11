let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const {  authenticateToken, limitTaskLength, enforceContentType } = require('./middleware');

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

let users = {
  username: "admin@gmail.com",
  password: "P@ssw0rd"
};

let tasks = [
  {
    username: "admin@gmail.com",
    title: "Implement Post Route for logging in.",
  },
  {
    username: "admin@gmail.com",
    title: "Implement custom middleware to authenticate user..."
  }
]


//-------------GET REQUEST---------------------

router.get('/findTasks', authenticateToken,( req, res)=>{
  try {
    setTimeout(() => {
      res.json(tasks)
    }, 1000)
  } catch (error) {
    console.error('Error fetching Tasks:', error.message);
    res.status(500).json({message: 'Internal Server Error'})
  }
})

//-------------POST REQUEST----------------------
// Route for user login with token authentication

router.post('/login', authenticateToken, function (req, res) {
  if (req.body.username === users.username && req.body.password === users.password) {
    let jwtToken = jwt.sign(
      {
        username: users.username,
        password: users.password,
      },
      "secretKey",
      { expiresIn: "1h" }
    );
    res.send(jwtToken);
  } 
  else {
    res.status(401).json({ message: "User not Authenticated" });
  }
});

// Route to register a new user
router.post('/register', (req, res) => {
  const { newUsername, newPassword } = req.body;

  if (!newUsername || !newPassword) {
    return res.status(400).json({ message: 'Username and password are required' });
  } 
  else if (Object.values(users).some((user) => user.username === newUsername)) {
    return res.status(409).json({ message: 'Username is already taken' });
  }

  const newUser = { username: newUsername, password: newPassword };
  users[newUsername] = newUser;

  const token = jwt.sign(
    { username: newUser.username },
    'secretKey',
    { expiresIn: '1h' }
  );

  res.json({ token });
});


// Route for adding a new task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
  try {
    const { newTask } = req.body;

    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });
    } 
    else if (tasks.some((task) => task.title.toLowerCase() === newTask.toLowerCase())) {
      return res.status(409).json({ message: 'Task title already exists' });
    } 
    else {
      const newTaskObject = {
        id: tasks.length + 1,
        username: req.decoded.username,
        title: newTask,
      };
      tasks.push(newTaskObject);
      res.json(newTaskObject);
    }
  } 
  catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//---------------PUT REQUEST------------------

router.put('/editTask/:id',  limitTaskLength, enforceContentType, (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTitle = req.body.value;

  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, title: updatedTitle } : task    
  );
  res.status(200).json({ success: true, tasks });

})

//--------------DELETE REQUEST--------------

router.delete('/deleteTask/:id', authenticateToken, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const taskToDelete = tasks.find((task) => task.id === taskId && task.username === req.user.username);

    if (!taskToDelete) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    tasks = tasks.filter((task) => task.id !== taskId);


    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
