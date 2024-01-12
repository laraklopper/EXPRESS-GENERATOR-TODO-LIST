import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from './components/Header';
import Login from './components/Login';
import Registration from './components/Registration';
import TaskForm from './components/Form';

// App function component
export default function App() {//Export default app function component
  // ===========STATE VARIABLES===============
  //user variables
  const [username, setUsername] = useState('');//State used to store the username entered by the user.
  const [password, setPassword] = useState('');//State used to store the password entered by the user
  const [newUsername, setNewUsername] = useState('');//State used to store newUsername
  const [newPassword, setNewPassword] = useState('');//State to store newPassword
  //task variables
  const [taskData, setTaskData] = useState([]);//State to store the data fetched from the server 
  const [taskInput, setTaskInput] = useState(' ');//State to store task Input
  //Event variables
  const [error, setError] = useState(null);//State to any error that occurs during data fetching or other operations.
  const [login, setLogin] = useState(false);//State used to indicates whether or not the user is logged in
  const [isRegistration, setIsRegistration] = useState(false);//State to handle registration

  // Effect to fetch tasks on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, []); // Use an empty dependency array to fetch tasks only once on component mount

  //===============REQUEST FUNCTIONS========================
  //------------GET REQUEST-----------------
  // Effect to fetch tasks when login status changes
  useEffect(() => {
    // Function to fetch tasks
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTaskData(data);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        setError('Error fetching Tasks: ' + error.message);
      }
    };

    if (login) {
      fetchTasks();
    }
  }, [login]);

  //-----------POST REQUESTS-----------------------
  // Function to submit login credentials
  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        setLogin(true);
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
      } else {
        throw new Error('Failed to Login');
      }
    } catch (error) {
      setError('Login Failed: ' + error.message);
      localStorage.removeItem('token'); // Clear the token on login failure
    }
  };

  // Effect to set login status and username from localStorage
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
      setUsername(storedUsername);
    }
  }, []);

  // Effect to set taskData from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  // Function to add a new task
  const addTask = async (taskInput) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: taskInput }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      setError('Error adding task: ' + error.message);
      localStorage.removeItem('token'); // Clear the token on error
    }
  };

  // Function to add a new user
  const addUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to add new user');
      }
    } catch (error) {
      setError('Error adding new user: ' + error.message);
      localStorage.removeItem('token'); // Clear the token on error
    }
  };

  //----------------PUT REQUEST-----------------------
  // Function to edit a task
  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: taskToUpdate.value,
        }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      setError('Error editing task: ' + error.message);
      localStorage.removeItem('token'); // Clear the token on error
    }
  };

  //-----------------DELETE REQUEST-----------------------
  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      setError('Error deleting task: ' + error.message);
      localStorage.removeItem('token'); // Clear the token on error
    }
  };

  //==============EVENT LISTENERS========================
  // Function to handle logout
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    handleLogout();
  };

  const logout = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setLogin(false);
  };

  const appLogin = () => {
    setLogin(false);
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  // Function to toggle between login and registration pages
  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUsername('');
    setNewPassword('');
    setUsername('');
    setPassword('');
  };

  //====================JSX RENDERING==============================

  return (
    <Container id='appContainer'>
      <Header />
      {login ? (
        <section id='section2'>
          <div>
            <Row id='formHeader'>
              <Col className='formCol'>
                <h2 className='h2'>ADD TASK</h2>
              </Col>
            </Row>
            <TaskForm
              username={username}
              taskInput={taskInput}
              setUsername={setUsername}
              setTaskInput={setTaskInput}
              addTask={addTask}
            />
          </div>
          {error ? (
            <div>{error}</div>
          ) : (
            <>
              {!taskData.length ? (
                <p>No tasks Found</p>
              ) : (
                <ul>
                  {taskData.map((task) => (
                    <li key={task.taskId} id='tasks'>
                      <div>{task.taskId}</div>
                      <div>
                        <Button variant='primary' onClick={() => editTask(task.taskId)}>
                          EDIT
                        </Button>
                      </div>
                      <div>
                        <Button variant='primary' onClick={() => deleteTask(task.taskId)}>
                          DELETE
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {error && <p>{error}</p>}
          <Row id='logout'>
            <Col id='logoutCol'>
              <Button variant='primary' onClick={logout} id='logoutBtn'>
                Logout
              </Button>
            </Col>
          </Row>
        </section>
      ) : (
        <section id='section1'>
          <div>
            {isRegistration ? (
              <Registration
                addUser={addUser}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
              />
            ) : (
              <Login
                submitLogin={submitLogin}
                login={login}
                handleLogoutClick={handleLogoutClick}
                setUsername={setUsername}
                setPassword={setPassword}
                username={username}
                password={password}
              />
            )}
            <Row id='pageToggleRow'>
              <Col id='toggleCol'>
                <Button variant='primary' onClick={togglePage} id='registrationBtn'>
                  {isRegistration ? 'Login Page' : 'Registration Page'}
                </Button>
              </Col>
            </Row>
          </div>
        </section>
      )}
    </Container>
  );
}
