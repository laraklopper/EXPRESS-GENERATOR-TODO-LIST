// Import React and necessary components from Bootstrap
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
import ToggleBtn from './components/ToggleBtn';//Import the ToggleBtn component
import LogoutBtn from './components/LogoutBtn';//Import the LogoutBtn component

//App function component
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({ 
    user: '', 
    title: '' 
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);
  const [token, setToken] = useState(null);


  //============USE EFFECT HOOK TO FETCH TASK DATA============
  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetchTasks
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const fetchedData = await response.json();
          setTaskData(fetchedData);
          console.log(fetchedData);
        } else {
          throw new Error('Failed to fetch tasks');;
        }
      } catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`);
        console.error('Error fetching data:', error);
      }
    }

    fetchTasks();//Invoke callback function
  }, [token]);

  //----------------POST REQUEST--------------------------

  //Function to submit login
  const submitLogin = async () => {//Define async function to submit login
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

    
      if (response.ok) {
        const data = await response.json(); 
        setToken(data.token);      

        console.log('Successfully logged in');
        setLogin(true);
        setLoginStatus(true); 
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Failed to login');;
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed: ${error.message}`);
    }
  };

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a newUser
    try {
      const token = localStorage.getItem('token'); 
      // const token = '';// Set an initial empty token
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          console.log('New user successfully added');
          const users = JSON.parse(localStorage.getItem('users')) || [];
          localStorage.setItem('users', JSON.stringify(users));     
          localStorage.setItem('token', data.token);
        } 
        else {
          throw new Error('Invalid server response'); 
        }
      } 
      else {
        throw new Error('Failed to add new user');
      }
    } 
    catch (error) {      
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  };

  //Function to add a task
  const addTask = async (newTask) => {//Define an async funciton to add a new Task
    try {
      //const token = localStorage.getItem('token')
      const token = ''; 
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user: newTask.user, title: newTask.title }),
      });
      
      if (response.ok) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        console.log('Task added successfully');      

        // setNewTask({ username: '', title: '' });
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to add task');
      }
    } 
    catch (error) {
     
      console.error('Error adding task:', error.message);
      setError('Error adding task', error.message);
    }
  };
  //-------------PUT REQUEST---------------------
  // Function to edit a task
  const editTask = async (taskId) => {//Define an async function to edit tasks
    try {
      const token = '';
    // const token = localStorage.getItem('token');
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: taskToUpdate.title,
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
    } 
    catch (error) {
    console.error('Error editing task:', error.message);
    setError('Error editing task. Please try again.');
    localStorage.removeItem('token');
    }
  };

  // ----------------DELETE REQUEST---------------------
  // Function to delete a task
  const deleteTask = async (taskId) => {//Definc an async function to delete a task
    try {
      const token = '';
  //   const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });


      if (response.ok) {
        const updatedList = await response.json();
        setTaskData(updatedList);
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

  //===============Event Listeners===========

  // Function to toggle between registration and login pages
  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUsername('');
    setNewPassword('');
    setUsername('');
    setPassword('');
  };

  /* Function to set login status to false, 
  indicating that the user is in the process of logging in*/
  const appLogin = () => {
    setLoginStatus(false);
  };

  // Function to handle logout button click
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token'); 
  };

  //Function to trigger logout button
  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
  };


  //===========JSX RENDERING==================

  return (
    <>
    {/* App Body */}
      <div id='appBody'>
        {/* App container */}
        <Container id='appContainer'>
          {/* Header */}
          <Header />
          {loginStatus ? (
            <div>
              <section id='section1'>
                <div>
                  
                  {isRegistration ? (
                    // Registration Form
                    <RegistrationForm
                      addUser={addUser}
                      newUsername={newUsername}
                      setNewUsername={setNewUsername}
                      newPassword={newPassword}
                      setNewPassword={setNewPassword}
                    />
                  ) : (
                    // Login Form
                    <LoginForm
                      login={login}
                      submitLogin={submitLogin}
                      appLogin={appLogin}
                      handleLogoutClick={handleLogoutClick}
                      username={username}
                      password={password}
                      setUsername={setUsername}
                      setPassword={setPassword}
                    />
                  )}
                  {/* Button to toggle between the login and registration page */}
                  <ToggleBtn
                    isRegistration={isRegistration}
                    togglePage={togglePage}
                  />
                </div>
              </section>
            </div>
          ) : (
            // Section 2
            <section id='section2'>
                {/* Form to add a new task */}
              <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
                {/* Error Message */}
              {error ? (
                <div>{error}</div>
              ) : (
                <div>
                  {/* Task output */}
                  <ul>
                    {taskData.map((task) => (
                      <li key={task.taskId} className='taskList'>
                        <Row id='taskOutputRow'>
                          <Col className='tasksCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>USER:</p>
                            </label>
                            <p className='outputText'>{task.username}</p>
                          </Col>
                          <Col className='tasksCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>TASK:</p>
                            </label>
                            <p className='outputText'>{task.title}</p>
                          </Col>
                          <Col className='tasksCol'>
                            {/* Button to edit a task */}
                            <Button variant="primary" onClick={() => editTask(task.taskId)}>
                              EDIT
                            </Button>
                          </Col>
                          <Col className='tasksCol'>
                            {/* Button to delete a task */}
                            <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                              DELETE
                            </Button>
                          </Col>
                        </Row>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Logout button */}
              <LogoutBtn logout={logout} />
            </section>
          )}
        </Container>
      </div>
    </>
  );
}
