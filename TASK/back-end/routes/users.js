const express = require('express');
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const router = express.Router();
const {
  checkJwtToken,
  authenticateUser,
  validateUsername,
  limitTaskLength,
  enforceContentType,
  limitUpdatedTaskLength, 
} = require('./middleware');

router.use(express.json());

//===========DATA==================
//----------USER DATA---------------------
// In-memory array used to store the data
let users = [
  {
    username: 'admin@gmail.com',
    userId: '0',
    password: 'passWord1',
  },
  {
    username: 'user1@gmail.com',
    userId: 1,
    password: 'passWord2',
  },
];

//----------TASKS DATA---------------------------
// In-memory array used to store the data
let tasks = [
  {
    user: "admin@gmail.com",
    taskId: 0,
    title: "Implement a Post route for logging in",
  },
  {
    username: "user1@gmail.com",
    taskId: 1,
    title: "Implement custom middleware to authenticate user",
  },
];
//===========Function to generate unique userId=======
function generateUniqueId() {
  const id = Math.floor(Math.random()*1000)
  return id
}
//===========ROUTES=================
//Route for handling GET to users/ base route endpoint
router.get('/', (req, res, next) => {
  res.send('Respond with resource');
});

// Route to send a GET requestt to the '/findTasks' endpoint
router.get('/findTasks', checkJwtToken, (req, res) => {
  const taskId = req.query.taskId; // Extract the 'taskId' from the query parameters of the request
  
 // Conditional rendering to check if 'taskId' is provided in the request query
  if (taskId) {
     // Find the task in the 'tasks' array that matches the provided 'taskId'
    const task = tasks.find(task => task.taskId === parseInt(taskId));//Search for a task in the tasks array whose taskId matches the provided taskId.
    // parseInt(taskId) is used to convert taskId from string to integer because taskId might be passed as a string in the URL.
    // If the task is found, send it as a JSON response
    if (task) {
      res.json(task)//Send the task as a JSON response to the client.
    } 
    else {
       // If task is not found, send a 404 (Not Found) response with an error message
      res.status(404).send({ message: 'Task not found'})
    }
  } else {  // If no 'taskId' is not provided, send all tasks as a JSON response
    res.json(tasks);//Send the entire tasks array as a JSON response
    console.log(tasks);//Log the tasks array to the console for debugging purposes
  }
});



//Route for handling users/login endpoint
router.post("/login", /*authenticateUser*/, (req, res) => {//Route for the HTTP request
  //authenticateUser is a middleware function used for authenticating user credentials during login.
  console.log(req.body);
  console.log('user is logged in');
  try{
     const { username, password } = req.body;//Extract the username and password from the request body
    const user = users.find(user => user.username === username && user.password === password);
   // Find user in the 'users' array matching the provided username and password
  const user = users.find(user => user.username === username && user.password === password);
  //Conditional rendering to check if the user is found
  if (user) {
    // Generate a JWT token with user information
    const jwtToken = jwt.sign(
      {
        username: user.username, userId: user.userId 
      },
      'secretKey',    // Secret key used to sign the token
      {
        expiresIn: '12h',     // Token expiration time set to 12 hours    
        algorithm: 'HS256'    // Algorithm used to sign the token
      }
    );
    
    res.json({ token: jwtToken});//The generated token is sent back as a JSON response
  }
  catch(error){
    
  }
  // const { username, password } = req.body;//Extract the username and password from the request body
  
 // Find user in the 'users' array matching the provided username and password
  const user = users.find(user => user.username === username && user.password === password);
  //Conditional rendering to check if the user is found
  if (user) {
    // Generate a JWT token with user information
    const jwtToken = jwt.sign(
      {
        username: user.username, userId: user.userId 
      },
      'secretKey',    // Secret key used to sign the token
      {
        expiresIn: '12h',     // Token expiration time set to 12 hours    
        algorithm: 'HS256'    // Algorithm used to sign the token
      }
    );
    
    res.json({ token: jwtToken});//The generated token is sent back as a JSON response
  } else {

    console.error('Login failed');//Log an error message in the console for debugging purposes
    res.status(401).json({ message: "User not Authenticated" });//Send a 401 (unauthorized) response with an error message
  }
});


//Route for handling POST request to the /users/register endpoint
router.post('/register',validateUsername, (req, res) => {//Route for the HTTP request
  try {
    const { newUsername, newPassword } = req.body;//Extract the newUsername and newPassword from the request body

   //Conditional rendering to check if the newUsername or newPassword is not provided
    if (!newUsername || !newPassword) {
      // Send a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Username and password are required' });
    }
          // Conditional rendering to check if 'newUsername' already exists in the 'users' array
    else if (users.find((user) => user.username === newUsername)/*users.some((user) => user.username === newUsername)*/) {
      return res.status(409).json({ message: 'Username is already taken' });//Send a 409(Conflict) response with an error message
    }
    // Create a new user object with 'newUsername', 'newPassword', and a unique 'userId'

    const newUser = { username: newUsername, password: newPassword, userId: users.length + 1 };
    users.push(newUser);//Push the new user objectto the 'users' array
      
    console.log(newUser);// Log the newly registered user to the console for debugging
    
    const token = jwt.sign(
      { username: newUser.username },  // Payload containing the 'username'
      'secretKey',// Secret key used to sign the token
      { expiresIn: '12h' } // Token expiration time set to 12 hours   
    );

    res.json({ token });
  } 
  catch (error) {
    console.error('Error registering user:', error.message); //Log an error message to the console for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });// Send a 500 (Internal Server Error) response with an error message
  }
});

//Route to add a new Task "/addTask" endpoint
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {//Route for the HTTP request
  //limitTaskLength and enforceContentType are middleware functions used to limit the length of the task name and enforce a specific content type for the request body
    const { newTask } = req.body;//Extract the newTask from the request body

    //Conditional rendering to check if newTask is not provided
    if (!newTask) {
      // Send a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Task name is required' });
    }
      // Conditional rendering to check if a task with the same title already exists in the 'tasks' array
    else if (tasks.some((task) => task.title === newTask)) {
// Send a 409 (Conflict) response with an error message
      return res.status(409).json({ message: 'Task title already exists' });
    }
    else {// If 'newTask' is provided and is unique
      const newTaskObject = {id: tasks.length + 1,    title: newTask,};//Create a new task object with a unique 'id' and 'title'
      tasks.push(newTaskObject);// Push the new task object to the 'tasks' array
      res.json(newTaskObject);// Send the newly added task object as a JSON respons

    }

});

// Route for handling PUT requests to "/editTask/:id"
router.put('/editTask/:taskId', limitUpdatedTaskLength, (req, res) => {//Route for the HTTP request
     const taskId = parseInt(req.params.taskId)//Extract the 'taskId' from the request parameters
    const updatedTitle = req.body.value;// Extract the updated task title from the request body
  try {
    // Update the 'title' property of the task with matching 'taskId'
    tasks = tasks.map((task) => task.id === taskId ? { ...task, title: updatedTitle } : task);


    res.status(200).json({success: true, tasks})// Send a 200 (OK) response with a success message and updated tasks
  } 
  catch (error) {
    console.error('Error editing tasks', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({message: 'Internal Server Error'})// Send a 500 (Internal Server Error) response with an error message
  }
})

// Route for handling DELETE requests to "/deleteTask/:id"
router.delete('/deleteTask/:taskId', authenticateToken, (req, res) => {//Route for the HTTP request
  try {
    const taskId = parseInt(req.params.id);    // Extract the 'taskId' from the request parameters

// Find the index of the task to delete in the 'tasks' array
    const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);
    // Conditional rendering to check if the task to delete exists and the requesting user has permission to delete it
    if (taskToDeleteIndex === -1 || tasks[taskToDeleteIndex].username !== req.user.username) {
      // If task not found or permission to delete is forbidden, send a 404 (Not Found) response with an error message
      return res.status(404).json({ message: 'Task not found or permission to remove task is forbidden' });
    }

    tasks.splice(taskToDeleteIndex, 1);//Remove the task from the tasks array
    res.status(200).json(tasks);// Send a 200 (OK) response with the updated 'tasks' array
  } 
  catch (error) {
    console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' });//Send a 500 (Internal Server Error) response with an error message
  }
});

module.exports = router;//Export the router to make it available in other parts of the application
