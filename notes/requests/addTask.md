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
// users.js

const { limitTaskLength, enforceContentType } = require('./middleware');

router.post('/addTask', limitTaskLength, enforceContentType, (req, res) => {
    try {
        const { newTask } = req.body;

        if (!newTask || !newTask.title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        if (tasks.some((task) => task.title === newTask.title)) {
            return res.status(409).json({ message: 'Task title already exists' });
        }

        const newTaskObject = {
            id: tasks.length + 1,
            title: newTask.title,
        };

        tasks.push(newTaskObject);
        res.json(tasks);
        console.log('Task added successfully:', newTaskObject);
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
```
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

