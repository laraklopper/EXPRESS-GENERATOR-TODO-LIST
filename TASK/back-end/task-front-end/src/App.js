// Import React and necessary components from Bootstrap
import React, { useEffect, useState } from 'react';
import './App.css';
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ToggleBtn from './components/ToggleBtn';
import TaskForm from './components/TaskForm';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  //Task Variables
  const [tasks, setTasks] = useState([]);//State used to store tasks
  const [newTask, setNewTask] = useState({ //State used to store details of a newTask
    user: '', // User associated with the new task
    newTaskTitle: '' // Title of the new task
  });
  const [taskToUpdate, setTaskToUpdate] = useState({// State variable to store details of the task to be updated
    updatedUser: '',// Updated user for the task
    updatedTitle: '',// Updated title for the task
  })
  //UserVariable
  const [userData, setUserData] = useState({// State variable to store user login credentials
    username: '',// Username for authentication
    password: ''// Password for authentication
  });
  const [newUserData, setNewUserData] = useState({//State used to store new UserDetails
    newUsername: '',// New username for registration
    newPassword: ''// New password for registration
  });
  //Event Variables
  const [error, setError] = useState(null);// State variable to store any errors that occur
  const [login, setLogin] = useState(false);// State variable to track user login status
  const [loginStatus, setLoginStatus] = useState(true);// State variable to track the status of the login process
  const [isRegistration, setIsRegistration] = useState(false);// State variable to track whether the user is in registration mode
  const [token, setToken] = useState(null);// State variable to store the JWT token for authentication


  //============USE EFFECT HOOK TO FETCH TASK DATA============
  // Fetch tasks from the server on component mount
  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetchTasks
      try {
        const token = localStorage.getItem('token');//Retrieve the JWT token from local storage
        //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',//Specify the Content-Type
            'Authorization': `Bearer ${token}`,
          },
        });

        
        if (response.ok) {
          const fetchedData = await response.json();
          setTasks(fetchedData);
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
    e.preventDefault();
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//HTTP request method
        mode: 'cors', // Cross-origin resource sharing mode
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type
        },
        body: JSON.stringify({ // Request body containing user login credentials
                username: userData.username, // Username entered by the user
                password: userData.password, // Password entered by the user
            }),
      });

    // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
         // If successful, parse the response body as JSON
        const data = await response.json(); // JSON data received from the server
        setToken(data.token); // Set the JWT token received from the server in the state

        console.log('Successfully logged in');// Log a success message to the console
        setLogin(true);// Update login state to indicate successful login
        setLoginStatus(true);  // Update login status state to indicate successful login
          // Store login status, username, and token in local storage for persistence
          localStorage.setItem('loginStatus', JSON.stringify(true)); // Login status
          localStorage.setItem('username', userData.username); // Username
         localStorage.setItem('token', data.token); // JWT token
      } else {
        throw new Error('Failed to login'); //Throw an error message if the POST request is unsuccessful
      }
    } catch (error) {
      console.error('Login Failed', error.message);//Log an error message in the cosole for debugging purposes
      setError(`Login Failed: ${error.message}`);// Set the error state with an error message
    }
  };

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a newUser
    try {
      const token = localStorage.getItem('token'); //Retrieve the JWT token from localStorage
      // const token = '';// Set an initial empty token
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
          body: JSON.stringify({ // Request body containing new user's username and password
                newUsername: newUserData.newUsername, // New username entered by the user
                newPassword: newUserData.newPassword, // New password entered by the user
            }),
      });
      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          console.log('New user successfully added');
          const users = JSON.parse(localStorage.getItem('users')) || [];
          // Create a new user object with username, password, and unique userId
                const newUser = { 
                    username: newUserData.newUsername, // New username
                    password: newUserData.newPassword, // New password
                    userId: users.length + 1 // Generate unique userId
                };
          users.push(newUser)// Push the new user object to the existing users array
                
          localStorage.setItem('users', JSON.stringify(users));// Store updated users array in local storage
          localStorage.setItem('token', data.token);// Store the token from the response in local storage

        } 
        else {
          throw new Error('Invalid server response'); // If the response does not contain a token, throw an error
        }
      } 
      else {
        throw new Error('Failed to add new user'); //Throw an error message if the POST request is unsuccessful
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
      const token = localStorage.getItem('token')
      // const token = ''; 
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user: newTask.user, title: newTask.newTaskTitle }),
      });
      
      if (response.ok) {
        const updatedList = await response.json();
        setTasks(updatedList);
        console.log('Task added successfully');      

        setNewTask({ user: '', title: '' });
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
      // const token = '';
      const token = localStorage.getItem('token');
      // const taskToUpdate = tasks.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskToUpdate),
        // body: JSON.stringify({value: taskToUpdate.title,}),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        console.log('Task successfully updated');
        const updatedList = await response.json();
        setTasks(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } 
      else {
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
      // const token = '';
      const token = localStorage.getItem('token');
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
        setTasks(updatedList);
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

  //Function to toggle between Registration and logout page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    setNewUserData({ newUsername: '', newPassword: '' })
    setUserData({ username: '', password: '' })
  }

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
              {/* Section1 */}
              <section id='section1'>
                <div>
                  {isRegistration ? (
                    // Registration Form
                    <RegistrationForm
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
                  ) : (
                    // Login Form
                    <LoginForm
                      login={login}
                      submitLogin={submitLogin}
                      appLogin={appLogin}
                      handleLogoutClick={handleLogoutClick}
                      userData={userData}
                      setUserData={setUserData}
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
                  <ul id='taskList'>
                    {tasks.map((task) => (
                      <li key={task.taskId} className='taskItem'>
                        <Row className='taskOutputRow'>
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
                        </Row>
                        <Row className='taskOutputRow'>
                          <Col className='tasksCol'>
                            {/* Button to edit a task */}
                            <Button variant="primary" onClick={() => editTask(task.taskId)}>
                              EDIT
                            </Button>
                            <label>
                              <p className='labelText'>UPDATE USER</p>
                              <input
                                value={taskToUpdate.updatedUser}
                                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, updatedUser: e.target.value })}
                                type='text'
                              />
                            </label>
                          </Col>
                          <Col>
                            <label>
                              <p className='labelText'>UPDATE USER</p>
                              <input
                                value={taskToUpdate.updatedTitle}
                                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, updatedTitle: e.target.value })}
                                type='text'
                              />
                            </label>
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
