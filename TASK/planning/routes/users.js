const express = require('express');
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const router = express.Router();
const {
  // authenticateToken,
  checkJwtToken,
  validateUsername,
  limitTaskLength,
  enforceContentType,
  limitUpdatedTaskLength,
  authenticateUser,
} = require('./middleware');

router.use(express.json());

//===========DATA==================
//----------USER DATA---------------------
// In-memory array used to store the data
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

//----------TASKS DATA---------------------------
// In-memory array used to store the data
let tasks = [
  {
    user: "admin@test.co.za",
    taskId: 0,
    title: "Implement a Post route for logging in",
  },
  {
    username: "admin@test.co.za",
    taskId: 1,
    title: "Implement custom middleware to authenticate user",
  },
];

// let tasks = [
//   {
//     user: 'user1@gmail.com',
//     userId: 0,
//     title: 'Task1',
//   },
//   {
//     user: 'user2@gmail.com',
//     userId: 1,
//     title: 'Task2',
//   },
// ];



//===========ROUTES=================
//Route for handling GET to users/ base route endpoint
router.get('/', (req, res) => {
  res.redirect('/login')
})

// Route to send a GET requestt to the '/findTasks' endpoint
router.get('/findTasks', checkJwtToken, (req, res) => {//Route for the HTTP request
  const taskId = req.query.taskId;

  if (taskId) {
    const task = tasks.find(task => task.taskId === parseInt(taskId));

    if (task) {
      res.json(task)
    } 
    else {
      res.status(404).send({ message: 'Task not found'})
      
    }
  } else {
    res.json(tasks)
    console.log(tasks);
  }
});


// router.get('/findTasks', authenticateToken, (req, res) => {
//     try {
//         const userTasks = tasks.filter((task) => task.userId === req.user.userId);

//         if (userTasks.length > 0) {
//             res.json({
//                 login: true,
//                 userTasks: req.user,
//                 tasks: tasks
//             });
//         } else {
//             res.status(401).json({
//                 login: false,
//                 message: 'Invalid Token',
//             });
//         }
//         console.log('Tasks:', userTasks);

//     } catch (error) {
//         console.error('Error finding tasks:', error);
//         res.status(500).json('Internal server error');
//     }
// });

//Route for handling users/login endpoint
router.post("/login", authenticateUser, (req, res) => {//Route for the HTTP request
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    const jwtToken = jwt.sign(
      {
        username: user.username, userId: user.userId 
      },
      'secretKey',    
      {
        expiresIn: '12h'         
        // algorithm: 'HS256'      
      }
    );
    
    res.json({ token: jwtToken});
  } else {

    console.error('Login failed');
    res.status(401).json({ message: "User not Authenticated" });
  }
});



//Route for handling POST request to the /users/register endpoint
router.post('/register',validateUsername, (req, res) => {//Route for the HTTP request
  try {
    const { newUsername, newPassword } = req.body;

   
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    else if (users.find((user) => user.username === newUsername)) {

      return res.status(409).json({ message: 'Username is already taken' });
    }
    // const newUser = { username: newUsername, password: newPassword };

    const newUser = { username: newUsername, password: newPassword, userId: users.length + 1 };
    users.push(newUser);
      
    console.log(newUser); 
    
    const token = jwt.sign(
      { username: newUser.username },  
      'secretKey',
      { expiresIn: '12h' }        
    );

    res.json({ token });
  } 
  catch (error) {
    console.error('Error registering user:', error.message); 
    res.status(500).json({ error: 'Internal Server Error' });  
  }
});


//Route to add a new Task "/addTask" endpoint
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Route for the HTTP request
  // try {
    const { newTask } = req.body;

    
    if (!newTask) {
      return res.status(400).json({ message: 'Task name is required' });
    }
    else if (tasks.some((task) => task.title === newTask)) {

      
      return res.status(409).json({ message: 'Task title already exists' });
    }
    else {
      const newTaskObject = {id: tasks.length + 1,    title: newTask,};

      tasks.push(newTaskObject);
      res.json(newTaskObject);

    }
  // }
  // catch (error) {
  //   console.error('Error adding task:', error.message);
  //   res.status(500).json({ message: 'Internal Server Error' });
  // }
});

// Route for handling PUT requests to "/editTask/:id"
router.put('/editTask/:taskId', limitUpdatedTaskLength, (req, res) => {//Route for the HTTP request
  try {
    const taskId = parseInt(req.params.taskId)
    const updatedTitle = req.body.value;
 
    tasks = tasks.map((task) => task.id === taskId ? { ...task, title: updatedTitle } : task);


    res.status(200).json({success: true, tasks})
  } 
  catch (error) {
    console.error('Error editing tasks', error.message);
    res.status(500).json({message: 'Internal Server Error'})
  }
})


// Route for handling DELETE requests to "/deleteTask/:id"
router.delete('/deleteTask/:taskId', authenticateToken, (req, res) => {//Route for the HTTP request
  try {
    const taskId = parseInt(req.params.id);

    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
      
      return res.status(404).json({ message: 'Task not found or permission to remove task is forbidden' });
    }

    tasks.splice(taskToDeleteIndex, 1);

    res.status(200).json(tasks);
  } 
  catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });

  }
});
module.exports = router;//Export the router to make it available in other parts of the application
