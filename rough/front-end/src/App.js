import React, { useState, useEffect } from 'react';

export default function App() {
  const [taskData, setTaskData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          const fetchedData = await response.json();
          setTaskData(fetchedData.tasks); // Update state with tasks data
          setIsLoaded(true);
          console.log(fetchedData.tasks);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        setIsLoaded(true);
      }
    }

    fetchTasks();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  } 
  else if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {

    return (
      <div>
        <h1>Tasks</h1>
        <ul>
          {taskData.map(task => (
            <li key={task.id}>
              {task.title} - {task.username}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}


