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

// Protected route to retrieve tasks
// router.get('/findTasks', authenticateToken, (req, res) => {
//   res.json({tasks});
// })

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

//----------------------POST REQUESTS----------------------------

// Route for user login
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;//Extract the username and password from the request body
  
//   // Find a user in the 'users' array whose username and password match the provided credentials
//   const user = users.find(user => user.username === username && user.password === password);  

//   //Conditional rendering based on whether a user is found
//   if (user) {
//     const jwtToken = jwt.sign(// If a user is found, generate a JWT token using the 'jwt.sign' method
//       {
//         username: user.username,// Payload of the JWT token includes the username
//       },
//       'userLoginSecretKey',// Secret key used to sign the JWT token
//       {
//         expiresIn: '1h', // Token expiration time set to 1 hour
//         algorithm: 'HS256'// Algorithm used for signing the JWT token
//       }
//     );
//     res.json({ token: jwtToken });    // Respond with  a JSON object containing the generated JWT token

//   }
//   else {
//     // If no user is found with the provided credentials, log an error and respond with a 401 status
//     console.error('Login failed'); //Display an error message in the console for debugging purposes
//     res.status(401).json({ message: "User not Authenticated" });//Respond with a 401 Unauthorized status and a JSON object containing an error message 
//   }
// });

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

// Route to register a new user 
// router.post('/register', validateUsername, (req, res,) => {
//   try {
//     const { newUsername, newPassword } = req.body;//Extract the newUsername and newPassword from the request body 

//     // Conditional rendering to check if the newUsername or newPassword is missing
//     if (!newUsername || !newPassword) {
//       // If either are missing, respond with a 400 Bad Request status and an error message
//       return res.status(400).json({ message: 'Username and password are required' });

//     }
//     else if (users.find((user) => user.username === newUsername)) {// Conditional rendering to check if the username is already taken
//       // If it is, respond with a 409 Conflict status and an error message
//       return res.status(409).json({ message: 'Username is already taken' });
//     }
//     const newUser = { username: newUsername, password: newPassword }; // If username is unique, create a new user object
//     users.push(newUser);  //Add a new User to the users array

//     console.log(newUser); //Log the newUser to the console

//     // Generate a JWT token for the newly registered user
//     const token = jwt.sign(
//       { username: newUser.username },//JWT payload
//       'newUserSecretKey',// secret key used to sign the JWT.
//       { expiresIn: '1h' }// Specify the time until the  JWT will expire  (1 hour).
//     );

//     res.json({ token });    // Respond with the generated JWT token
//     console.log(token); //Log the JWT token in the console

//   } 
//   catch (error) {
//     console.error('Error registering user:', error.message);//Log an error message in the console for debugging purposes
//     res.status(500).json({ error: 'Internal Server Error' });//Respond with a 500 Internal Server Error status code and an error message
//   }
// });
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

//Route to add a new Task
// router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Define the route for the HTTP request
//   try {
//     const {  newTask } = req.body;
//     // Conditional rendering to check if 'newTask' or its 'title' property is missing
//     if (!newTask) {
//       return res.status(400).json({ message: 'Task name is required' });
//       // Respond with a 400 Bad Request status and an error message
//     }
//       // Conditional rendering to check if a task with the same title already exists in the 'tasks' array

//     if (tasks.some((task) => task.title === newTask.title)) {
//       return res.status(409).json({ message: 'Task title already exists' });
//     }
    
//       // Create a new task object with an 'id' and 'title'
//       const newTaskObject = {
//         id: tasks.length + 1,
//         title: newTask.title,
//       };

//       tasks.push(newTaskObject);
//       res.json(newTaskObject);
//       console.log(newTaskObject);  
//         console.log('log a success message in the console');

//     }
  
  
//   catch (error) {
//     console.error('Error adding task:', error.message);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// })

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


module.exports = router;//Export the router to make it available in other parts of the application

