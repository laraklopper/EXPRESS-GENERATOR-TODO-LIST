const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Sample tasks data
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
router.get('/findTasks', authenticateToken, (req, res) => {
  res.json({
    login: true,
    data: req.user, // Sending user information from decoded token
    tasks: tasks, // Sending tasks array to the frontend
  });
});

module.exports = router;

