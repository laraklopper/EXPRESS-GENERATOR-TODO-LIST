// Import necessary React components and Bootstrap components
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
//Components
import Header from './components/Header';//Import Header function component
import RegistrationForm from './components/RegistrationForm';//Import RegistrationForm function component
import LoginForm from './components/LoginForm';//Import LoginForm function component
import TaskForm from './components/Form';//Import TaskForm Function component

//App function component
export default function App() {//Export default App Function component
  //===========STATE VARIABLES=======================
  const [taskData, setTaskData] = useState([]);//State to store the data fetched from the server 
  const [isLoaded, setIsLoaded] = useState(false);//State to indicate whether the data has been loaded.
  const [error, setError] = useState(null);//Stores any error that occurs during data fetching or other operations.
  const [updatedTasks, setUpdatedTasks] = useState([]);//Stores tasks that have been updated.
  const [login, setLogin] = useState(false);//State used to indicates whether or not the user is logged in.
  const [password, setPassword] = useState('');//Stores the password entered by the user.
  const [username, setUsername] = useState('');//Stores the username entered by the user.
  const [loginStatus, setLoginStatus] = useState(true);//Indicates the login status.
  const [taskInput, setTaskInput] = useState('');//State to store Input
  const [newUsername, setNewUsername] = useState(' ');//State to store newUsername
  const [newPassword, setNewPassword] = useState('');//State tp store newPassword
  const [isRegistration, setIsRegistration] = useState(false);//State to handle registration

  //=========FETCH DATA==================
  // Fetch initial data from the server on component mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        if (response.status >= 200 && response.status < 300) {
          const data = await response.json();
          setTaskData(data);
          setIsLoaded(true);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('Error fetching data:', error.message);
        setIsLoaded(true);
      }
    }
    fetchTasks();
  }, []);

  //===============REQUEST FUNCTIONS========================
  //-----------------POST REQUESTS----------------------
  //Function to submit login
  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Successfully logged in');
        setLogin(true);
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError('Error logging in. Please try again.');
    }
  };

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [setTaskData]);

  
  //Function to addTask
  const addTask = async (taskInput) => {
    try {
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ value: taskInput }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log(updatedList);
        console.log('Task added successfully');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error.message);
      setError('Error adding task. Please try again.');
    }
  };


  //Function to add newUser
  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('New user successfully added');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to add new user');
      }
    } catch (error) {
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  }

  //----------------PUT REQUEST---------------------------
  //Function to editTask
  const editTask = async (taskId) => {
    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === taskId);
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          value: taskToUpdate.value,
        }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Task successfully updated');
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error.message);
      setError('Error editing task. Please try again.');
    }
  };

  //-----------------DELETE REQUEST------------------
  //Function to delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task successfully deleted');
        setUpdatedTasks([]);
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Error deleting task. Please try again.');
    }
  };


  //===============EVENT LISTENERS=======================

  // Event listener to set loginStatus to false
  const appLogin = () => {
    setLoginStatus(false);
  };

  // Event listener to handle logout click
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    handleLogout();
  };

  // Function to logout
  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  // Event listener to toggle between registration and login pages
  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUsername(''); // Reset new username input
    setNewPassword(''); // Reset new password input
    setUsername(''); // Reset login username input
    setPassword(''); // Reset login password input
  };


  //==============JSX RENDERING=============================

  return (
      <Container id='appContainer'>
        <Header />
        {loginStatus ? (
          <section id='section1'>
            <div>
              {isRegistration ? (
                <LoginForm
                  submitLogin={submitLogin}
                  login={login}
                  handleLogoutClick={handleLogoutClick}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  username={username}
                  password={password}
                />
              ) : (
                <RegistrationForm
                  addUser={addUser}
                  newUsername={newUsername}
                  setNewUsername={setNewUsername}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                />
              )}
              <Row id='pageToggleRow'>
                <Col id='toggleCol'>
                  <p id='toggleText'>CLICK HERE TO VISIT THE:</p>
                  <Button variant='primary' onClick={togglePage} id='registrationBtn'>
                    {isRegistration ? 'Login Page' : 'Registration Page'}
                  </Button>
                </Col>
              </Row>
            </div>
          </section>
        ) : (
          <section id='section2'>
            <TaskForm addTask={addTask} taskInput={taskInput} setTaskInput={setTaskInput} />
            {error ? (
              <div>{error}</div>
            ) : !isLoaded ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {taskData.map((task) => (
                  <li key={task.taskId} id='tasks'>
                    <div>
                      {task.taskId}
                    </div>
                    <div>
                      <Button variant="primary" onClick={() => editTask(task.taskId)}>
                        EDIT
                      </Button>
                    </div>
                    <div>
                      <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                        DELETE
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {error && <p>{error}</p>}
            <Row>
              <Col>
                <Button variant="primary" onClick={logout}>
                  Logout
                </Button>
              </Col>
            </Row>
          </section>
        )}
      </Container>
  );
}
