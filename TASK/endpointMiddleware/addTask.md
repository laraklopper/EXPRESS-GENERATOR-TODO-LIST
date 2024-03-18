# ADDTASK ENDPOINT

### MIDDLEWARE.JS

```javascript
// Custom middleware to enforce JSON content type and limit task length
function validateTask(req, res, next) {
  // Check if content type is JSON
  const contentType = req.headers['content-type'];

  if (!contentType || contentType !== 'application/json') {
    return res.status(400).json({ message: 'Content-Type must be application/json' });
  }

  // Check if task length is within limit
  const { user, title } = req.body;
  if (!user || !title) {
    return res.status(400).json({ message: 'User and title are required' });
  }
  if (title.length > 140) {
    return res.status(400).json({ message: 'Task title must be 140 characters or less' });
  }

  next(); // Move to the next middleware
}

module.exports = validateTask;
```
### USER.JS
You can then use this middleware before the route handler for the `/addTask` endpoint:

```javascript
//Route to send a POST request to the /addTask endpoint
router.post('/addTask', validateTask, async (req, res) => {
  console.log(req.body);
  console.log('add Task');
  try {
    const { user, title } = req.body;

    // Check if task already exists for the user
    const existingTask = await Task.findOne({ user, title });
    if (existingTask) {
      return res.status(409).json({ message: 'Task title already exists for this user' });
    }
    
    // Create and save the new task
    const newTask = new Task({ user, title });
    await newTask.save();

    console.log(newTask);
    return res.status(201).json(newTask);

  } catch (error) {
    console.error(`Error occurred while adding task: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
```
