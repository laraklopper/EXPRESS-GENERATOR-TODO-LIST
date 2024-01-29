const express = require('express');
const jwt = require('jsonwebtoken');
const { 
  authenticateToken, 
  limitTaskLength, 
  enforceContentType, 
  validateUsername, 
  } = require('./middleware');
const router = express.Router();

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

router.get('/', (req, res) => {
  try {
    res.json(tasks)
    console.log('success message');
  }
  catch (error) {
    res.send.status(500).json('Internal Server Error')
  }

})
//=============ROUTES===============
//----------------GET REQUEST------------------
// Protected route to retrieve tasks
router.get('/findTasks', authenticateToken, async (req, res) => {//Define the route for the HTTP request
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decode = jwt.verify(token, 'SecretKey', { expiresIn: '1h'})
    res.json({
      login : true,
      data: decode
    })
  } catch (error) {
    res.status(401).json({
      login: false,
      message: 'invalid Token'
    })
  }

});

//----------------------POST REQUESTS----------------------------

// Route for user login
router.post("/login", (req, res) => {
  // const authHeader = req.headers['authorization'];// Extract the JWT token from the Authorization header
  // const token = authHeader && authHeader.split(' ')[1];
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  // Search for a user in the users array with matching username and password.
  //Conditional rendering based on whether a user is found
  if (user) {
    const jwtToken = jwt.sign(
      {
        username: user.username,
      },
      'userLoginSecretKey',
      {
        expiresIn: '1h',
        algorithm: 'HS256'
      }
    );
    res.json({ token: jwtToken });
    console.log(jwtToken);
  }
  else {
    console.error('Login failed');
    res.status(401).json({ message: "User not Authenticated" });
  }
});

// Route to register a new user 
router.post('/register', validateUsername, (req, res,) => {
  try {
    const { newUsername, newPassword } = req.body;  

    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password are required' });

    }
    else if (users.find((user) => user.username === newUsername)) {// Conditional rendering to check if the username is already taken
      // If it is, respond with a 409 Conflict status and an error message
      return res.status(409).json({ message: 'Username is already taken' });
    }
    const newUser = { username: newUsername, password: newPassword }; // If username is unique, create a new user object
    users.push(newUser);  //Add a new User to the users array

    console.log(newUser); //Log the newUser to the console

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { username: newUser.username },//JWT payload
      'newUserSecretKey',// secret key used to sign the JWT.
      { expiresIn: '1h' }// Specify the time until the  JWT will expire  (1 hour).
    );

    res.json({ token });    // Respond with the generated JWT token
    console.log(token); //Log the JWT token in the console

  } 
  catch (error) {
    console.error('Error registering user:', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });//Respond with a 500 Internal Server Error status code and an error message
  }
});

//Route to add a new Task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Define the route for the HTTP request
  try {
    const { value } = req.body;// Extract the new task name from the request body
    // Conditional rendering to check if the new task name is provided
    if (!value) {
      return res.status(400).json({ message: 'Task name is required' });// respond with a 400 Bad Request status and an error message
    }
    else if (tasks.some((task) => task.title === value)) {
      return res.status(409).json({ message: 'Task title already exists' });
    }
    else {
      const newTaskObject = {
        id: tasks.length + 1,
        title: value,
      };

      tasks.push(newTaskObject);
      res.json(newTaskObject);
      console.log(newTaskObject);
    }
  }
  catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

//--------------------PUT REQUEST--------------------------

//Route to edit an existing task
router.put('/editTask/:id', authenticateToken, limitTaskLength, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const updatedTitle = req.body.value;

    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, title: updatedTitle } : task
    );

    saveTasksTofile();

    res.status(200).json({ success: true, tasks });
  } 
  catch (error) {
    console.error('Error editing tasks', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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
  } 

  catch (error) 
  {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






//----------------------
module.exports = router;//Export the router to make it available in other parts of the application

