# ADDTASK

## Back End
### Middleware.js:

```javascript
// middleware.js

// Middleware function to limit the length of a task title
function limitTaskLength(req, res, next) {
    const { newTask } = req.body;
    const maxLength = 140;

    if (newTask && newTask.title.length > maxLength) {
        return res.status(400).json({
            message: `Task title exceeds the maximum length of ${maxLength} characters.`,
        });
    }

    next();
}

// Middleware function to enforce the 'Content-Type' header to be 'application/json'
function enforceContentType(req, res, next) {
    const contentType = req.headers['content-type'];

    if (!contentType || contentType.indexOf('application/json') !== 0) {
        return res.status(415).send('Unsupported Media Type: Content-Type must be application/json');
    }

    next();
}

module.exports = {
    limitTaskLength,
    enforceContentType,
};
```

### users.js (Backend):

```javascript
// Route to add a new Task
router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
    try {
        const { newTask } = req.body;//Extract the newTask from the request body

        // Check if 'newTask' or its 'title' property is missing
        if (!newTask || !newTask.title) {
            // Respond with a 400 Bad Request status and an error message
            return res.status(400).json({ message: 'Task title is required' });
        }

        // Check if a task with the same title already exists in the 'tasks' array
        if (tasks.some((task) => task.title === newTask.title)) {
            // Respond with a 409 Conflict status and an error message
            return res.status(409).json({ message: 'Task title already exists' });
        }

        // Create a new task object with an 'id' and 'title'
        const newTaskObject = {
            id: tasks.length + 1,
            title: newTask.title,
        };

        // Add the new task object to the 'tasks' array
        tasks.push(newTaskObject);

        // Respond with the updated 'tasks' array
        res.json(tasks);

        // Log a success message to the console
        console.log('Task added successfully:', newTaskObject);
    } catch (error) {
        // Catch any errors that occur during the execution of the try block
        console.error('Error adding task:', error.message);

        // Respond with a 500 Internal Server Error status and an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
```

Explanation:

1. The code defines a route handler for the POST request to '/addTask'.
2. It uses middleware functions like `limitTaskLength` and `enforceContentType` to perform specific checks before executing the route handler.
3. The route handler first destructures the `newTask` property from the request body.
4. It checks if `newTask` or its `title` property is missing. If so, it responds with a 400 Bad Request status and an error message.
5. It then checks if a task with the same title already exists in the `tasks` array. If found, it responds with a 409 Conflict status and an error message.
6. If the checks pass, a new task object is created with an 'id' and 'title'.
7. The new task object is pushed to the `tasks` array.
8. The server responds with the updated `tasks` array.
9. A success message is logged to the console.
10. In case of any errors during the execution of the try block, an error message is logged to the console, and the server responds with a 500 Internal Server Error status and an error message.

## FRONTEND

### REACT.js 

```javascript
// React.js frontend

const addTask = async (newTask) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/addTask', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ newTask }),
        });

        if (response.status >= 200 && response.status < 300) {
            const updatedList = await response.json();
            setTaskData(updatedList);
            localStorage.setItem('tasks', JSON.stringify(updatedList));
            console.log('Task added successfully');
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error.message);
        setError('Error adding task', error.message);
    }
};
```

**Potential Improvements and Error Fixes:**

1. **Middleware Usage:** Ensure that the middleware functions (`limitTaskLength` and `enforceContentType`) are correctly imported and used in the `users.js` file.
2. **Task Title Validation:** Updated the validation in `limitTaskLength` middleware to check `newTask.title.length` instead of `newTask.length`.
3. **Backend Error Handling:** Improved the error handling in the backend by checking if `newTask.title` is present before performing additional checks.
4. **Frontend Body:** Modified the body in the frontend `addTask` function to send `newTask` directly, assuming that `newTask` is an object containing the necessary properties.

