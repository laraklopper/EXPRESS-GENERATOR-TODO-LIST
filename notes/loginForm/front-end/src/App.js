import React, { useState } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch tasks
  const fetchTasks = async () => {
    try {
      // Check if the authentication token is available
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      // Fetch tasks from the server
      const response = await fetch('http://localhost:3001/users/findTasks', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if the response is successful (status code between 200 and 299)
      if (response.ok) {
        // Parse the response body as JSON
        const fetchedData = await response.json();
        
        
        setTaskData(fetchedData);

        console.log(fetchedData);
      } else {
        // If the response status is not ok, throw an error
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  }

  // Call the fetchTasks function when the component mounts or when the token changes
  fetchTasks();
  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        console.log('Successfully logged in');
        setLogin(true);
        setLoginStatus(true);
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => { e.preventDefault(); submitLogin(); }}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
