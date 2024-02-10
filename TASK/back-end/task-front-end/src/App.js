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
export default function App() {
  //===========STATE VARIABLES=================
 //Task variables
  const [taskData, setTaskData] = useState([]);//State used to store the tasks retrieved from the server
  const [newTask, setNewTask] = useState({//Object state variable that holds the information for a new task
    username: '',
    title: ''
  });
   const [taskToUpdate, setTaskToUpdate] = useState({
    updatedUser: '',
    updatedTitle: '',
  })
  //User variables
  //String state variables used to store the user's input for login credentials
  const [username, setUsername] = useState('');//State used to store the username
  const [password, setPassword] = useState('');//State used to store the password
  //  const [userData, setUserData] = useState({
  //   username: '',
  //   password: '',
  // });
  // const [newUserData, setNewUserData] = useState({
  //   newUsername: '',
  //   newPassword: '',
  // });
  //String state variables used to store the user's input for new user registration credentials
  const [newUsername, setNewUsername] = useState('');//State used to store newUsername
  const [newPassword, setNewPassword] = useState('');//State used to store the ne
  const [error, setError] = useState(null);//State variable used to store any error messages that may occur during the API requests
  //Variables used to manage user login 
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  /*Boolean state variable that determines whether the user is in the registration mode and 
  is used to toggle between login and registration forms. */
  const [isRegistration, setIsRegistration] = useState(false);
  //State used to hold the authentication token recieved from the user upon successful login
  const [token, setToken] = useState(null);//State used to store the authentication token

  //============USE EFFECT HOOK TO FETCH TASK DATA============
  useEffect(() => {
//Function to fetch tasks
    const fetchTasks = async () => {
    try {      
      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      
      // Send a GET request to the `/findTasks` endpoint
      const response = await fetch('http://localhost:3001/users/findTasks', {
        method: 'GET',//Request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the content-type
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      // Conditional rendering if the response is successful (status code in the range of 200-299)
      if (response.ok) {
        
        const fetchedData = await response.json();// If successful, parse the response JSON data
      
        setTaskData(fetchedData);// Update the taskData state with the fetched data
      } else {
        throw new Error('Failed to fetch tasks');// Throw an error if the GET request is unsuccessful

      }
    } catch (error) {
      // Handle any errors that occur during the request
      setError(`Error fetching data: ${error.message}`);//Set the error state
      console.error('Error fetching data:', error);//Log an error message in the console for debugging purposes
    }
  }

  // Call the fetchTasks function when the component mounts or when the 'token' state changes
  fetchTasks();
}, [token]); // Dependency array with 'token' ensures the effect is re-run whenever the 'token' state changes

  //----------------POST REQUEST--------------------------

  //Function to submit login
  const submitLogin = async () => {//Define async function to submit login
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {//Set request headers
          'Content-Type': 'application/json',//Specify the content-type for the request body 
        },
        body: JSON.stringify({ username, password }),// Convert user credentials to JSON format for the request body
        // body: JSON.stringify({ username: userData.username, password: userData.password }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        const data = await response.json();// Parse the response JSON data
        setToken(data.token)

        console.log('Successfully logged in');// Display a success message in the console

        setLogin(true);// Set the 'login' state to true, indicating that the user is logged in
        setLoginStatus(true);// Set the 'loginStatus' state to true, indicating the overall login status
        localStorage.setItem('loginStatus', JSON.stringify(true));// Store the login status in localStorage as a string
        localStorage.setItem('username', username);// Store the username in localStorage
        localStorage.setItem('token', data.token);// Store the authentication token received from the server in localStorage
        // The login status is also stored in localStorage along with the username and token for persistence across sessions.
      }
      else {
        const errorData = await response.json();
        throw new Error('Failed to login');//Throw an error message if the POST request is unsuccessful
      }
    }
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
      setError(`Login Failed: ${error.message}`);//Set the error state with an error message
    }
  };

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a new User
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          // 'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Authorization': token ? `Bearer ${token}` : '',
        },
        //Request body
        body: JSON.stringify({ newUsername, newPassword }),// Send the new username and password as JSON in the request body
         // body: JSON.stringify({newUsername: newUserData.newUsername, newPassword: newUserData.newPassword}),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          console.log('New user successfully added');// If successful, log a success message and update the localStorage with the new user
          const users = JSON.parse(localStorage.getItem('users')) || [];// Retrieve existing users from localStorage or initialize an empty array
          // const newUser = { username: newUserData.newUsername, password: newUserData.newPassword, userId: users.length + 1 };
          localStorage.setItem('users', JSON.stringify(users));      // Update the localStorage with the updated users array
          localStorage.setItem('token', data.token);
          // setNewUserData({ newUsername: '', newPassword: '' });
        } else {
          throw new Error('Invalid server response')// If the server response does not contain a token, throw an error
        }
      }
      else {
        throw new Error('Failed to add new user');//Throw an error message if the POST request is unsuccessful
      }
    }
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error adding new user', error.message);//Display an error message in the console for debugging purposes
      setError("Error adding new user", error.message);// Sets the error state with an error message.
    }
  };

  //Function to add a task
  const addTask = async (taskInput) => {//Define an async funciton to add a new Task
    try {
      const token = localStorage.getItem('token');//Retrieve the authentication token from localStorage
      // Make a POST request to the server
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',//Request method
        mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
        },
        body: JSON.stringify({ username: newTask.username, title: newTask.title }),
        // body: JSON.stringify({ user: newTask.user, title: newTask.newTaskTitle }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));// Update the task data state with the updated list of tasks
        console.log('Task added successfully');//Log a success message in the console
      }
      else {
        throw new Error('Failed to add task');//Throw an error message if the POST request is unsuccessful
      }
    }
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error adding task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error adding task', error.message);//Set the error state
      localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
    }
  };

  //-------------PUT REQUEST---------------------
  //Function to edit a task
  const editTask = async (taskId) => {//Define an async function to edit a task
    try {
      const token = localStorage.getItem('token');
      // const taskToUpdate = taskData.find((task) => task.id === taskId);
      //Send a PUT request to the server
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        mode: 'cors',// Set the CORS mode to enable cross-origin requests
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskToUpdate),
        // body: JSON.stringify({ value: taskToUpdate.title,}),
      });
    // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        console.log('Task successfully updated');//Log a success message in the Console
        const updatedList = await response.json();// Parse the response data as JSON
        setTaskData(updatedList);      // Update the task data state with the updated list of tasks

        // localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');//Throw an error message if the PUT request is unsuccessful
      }
    } catch (error) {
            // Handle any errors that occur during the request

      console.error('Error editing task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error editing task. Please try again.');//Set the error state with an error message
      localStorage.removeItem('token');
    }
  };

  // ----------------DELETE REQUEST---------------------
  // Function to delete a task
  const deleteTask = async (taskId) => {//Define an async function to delete a task
    try {
      // const token = localStorage.getItem('token');
      
      const token = ''; // Set an initial empty token
      //Send a DELETE request to the server
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',// Set the CORS mode to enable cross-origin requests
        headers: {
          'Content-type': 'application/json',//Specify the Content-Type being passed
          'Authorization': `Bearer ${token}`,
        },
      });
// Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        const updatedList = await response.json();      // Parse the response data as JSON

        setTaskData(updatedList);// Update the task data state with the updated list of tasks
        // localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task successfully deleted');//Log a success message in the console
      } else {
        throw new Error('Failed to delete task');//Throw an error message if the DELETE request is unsuccessful
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set the error state
      // localStorage.removeItem('token');
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

  //  const togglePage = () => {
  //   setIsRegistration(!isRegistration); // Toggle the registration state between true and false
  //   setNewUserData({ newUsername: '', newPassword: '' });// Reset the new user data state to empty strings
  //   setUserData({ username: '', password: '' });// Reset the user data state to empty strings
  // }

  // Function to set login status to false, indicating that the user is in the process of logging in
  const appLogin = () => {
    setLoginStatus(false);
  };

  // Function to handle logout button click
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');//Remove the loginStatus from localStorage 
    localStorage.removeItem('username');//Remove the username from localStorage
    localStorage.removeItem('token'); //Remove the stored token from localStorage

  };

  //Function to trigger logout button
  const logout = () => {
    // Reset login status 
    setLoginStatus(true);
    setLogin(false);
  };
  //=============JSX RENDERING==================
  return (
    <>
    {/* App Body */}
      <div id='appBody'>
        {/* App Container */}
        <Container id='appContainer'>
          {/* Header */}
          <Header />
          {loginStatus ? (
            <div>
              {/* section1 */}
              <section id='section1'>
                <div>
                  {isRegistration ? (
                    // Registration form
                    <RegistrationForm
                    addUser={addUser}
                      newUsername={newUsername}
                      setNewUsername={setNewUsername}
                      newPassword={newPassword}
                      setNewPassword={setNewPassword}
                    />
                  ) : (
                    // LoginForm
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
            <section id='section2'>
              {/* Form to add a new task */}
              <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
                {/* Error Message */}
              {error ? (
                <div>{error}</div>
              ) :  (
                <div>
                  {/* Task Output */}
                  <ul>
                    {taskData.map((task) => (
                      <li key={task.taskId}>
                        <Row id='taskOutputRow'>
                          <Col className='tasksCol'>
                            <label className='taskLabel'>
                              <p>USER:</p>
                            </label>
                            <p>{task.username}</p>
                          </Col>
                          <Col className='tasksCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>TASK:</p>
                            </label>
                            <p className='labelText'>{task.title}</p>
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
              {/* Logut Button */}
              <LogoutBtn  logout={logout}/>
            </section>
          )}
        </Container>
      </div>
    </>
  );
}
