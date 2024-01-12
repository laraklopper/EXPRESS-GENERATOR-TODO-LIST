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
import TaskForm from './components/TaskForm';//Import TaskForm Function component

//App function component
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  //Task variables
  const [taskData, setTaskData] = useState([]);//State to store the array of tasks
  const [taskInput, setTaskInput] = useState('');//State to store 
  //User variables
  const [username, setUsername] = useState('');//State to store the password entered by the user.
  const [password, setPassword] = useState('');//State to store the password entered by the user.
  const [newUsername, setNewUsername] = useState(' ');//State to store newUsername
  const [newPassword, setNewPassword] = useState('');//State to store newPassword
  //Event variables  
  const [isLoaded, setIsLoaded] = useState(false);//State to indicate whether the data has loaded
  const [error, setError] = useState(null);//State to store any error that may occur during data fetching or operations
  const [login, setLogin] = useState(false);//State to represent the login status
  const [loginStatus, setLoginStatus] = useState(true);//State used to indicate the login status
  const [isRegistration, setIsRegistration] = useState(false);//State to indicate whether the user is using the registration form

  //===============USE EFFECT HOOKS==============
  // useEffect hooks to fetch tasks and initialize login status
  useEffect(() => {
    // Retrieve tasks from local storage using the key 'tasks'
    const storedTasks = localStorage.getItem('tasks');

    //Conditional rendering to check if there are tasks stored in localstorage
    if (storedTasks) {
      // If tasks are found, parse the JSON string and update the taskData state
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);

  //===============REQUESTS=====================
  //------------GET REQUEST-----------
  useEffect(() => {
    //Function to fetchTasks
    async function fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status >= 200 && response.status < 300) {
          const data = await response.json();
          setTaskData(data);
          setIsLoaded(true);
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

  //------------POST REQUESTS----------------------
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
  }, [taskData]);

  //Function to add a task
  const addTask = async (taskInput) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: taskInput }),
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
      localStorage.removeItem('token');
    }
  };

  //Function to add a newUser
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
  };

  //-------------------PUT REQUEST----------------------
  //Function to edit a task
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
      localStorage.removeItem('token');
    }
  };

  //--------------DELETE TASK------------------
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
        console.log('Task successfully deleted');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Error deleting task. Please try again.');
      localStorage.removeItem('token');
    }
  };

  const appLogin = () => {
    setLoginStatus(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    handleLogout();
  };

  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
    localStorage.removeItem('token');
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUsername('');
    setNewPassword('');
    setUsername('');
    setPassword('');
  };
//==========================JSX RENDERING=========================
  return (
    <Container id='appContainer'>
      <Header />
      {loginStatus ? (
        <section id='section1'>
          <div>
            {isRegistration ? (
              <RegistrationForm
                addUser={addUser}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
              />
            ) : (
              <LoginForm
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
