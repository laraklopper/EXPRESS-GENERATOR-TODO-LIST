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

//App function component
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  //Task variables
  const [taskData, setTaskData] = useState([]);//State to store the array of tasks
  const [taskInput, setTaskInput] = useState('');//State to store taskInput
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
    const storedTasks = sessionStorage.getItem('tasks');// Retrieve tasks from session storage using the key 'tasks'

    //Conditional rendering to check if there are tasks stored in sessionStorage
    if (storedTasks) {
      // If tasks are found, parse the JSON string and update the taskData state
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);// Use an empty dependency array to fetch tasks only once on component mount

  //===============REQUESTS=====================
  //------------GET REQUEST-----------
  useEffect(() => {
    //Function to fetchTasks
    async function fetchTasks() {//Define a async function to fetch tasks
      try {
        const token = sessionStorage.getItem('token');//Retrieve the authentication token from sessionStrorage
        //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Request method
          mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
          headers: {//Set the request headers
            'Content-Type': 'application/json',//Specify the type of content being passed
            'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
          }
        });

        // Conditional rendering to check if the server response is in the successful range (200-299)
        if (response.status >= 200 && response.status < 300) {
          const data = await response.json();// Parse the response body as JSON
          setTaskData(data);//Update the taskData state
          setIsLoaded(true);// Set the loading state to true
        } 
        else {
          throw new Error('Failed to fetch tasks'); //Throw an error message if the GET request is unsuccessful
        }
      } 
      catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`);//Set the error state
        setIsLoaded(true);//Set the isLoaded state to true
   //     console.error('Error fetching data:');//Display an error message in the console for debugging purposes
      }
    }
    // Call the fetchTasks function when the component mounts
    fetchTasks();
  }, []);

  //------------POST REQUESTS----------------------
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
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();// Parse the response JSON data

        console.log('Successfully logged in');// Display a success message in the console

        setLogin(true);// Set the 'login' state to true, indicating that the user is logged in
        setLoginStatus(true);// Set the 'loginStatus' state to true, indicating the overall login status
        sessionStorage.setItem('loginStatus', JSON.stringify(true));// Store the login status in sessionStorage as a string
        sessionStorage.setItem('username', username);// Store the username in sessionStorage
        sessionStorage.setItem('token', data.token);// Store the authentication token received from the server in sessionStorage
      } 
      else {
        throw new Error('Failed to login');//Throw an error message if the POST request is unsuccessful
      }
    } 
    catch (error) {  
      // Handle any errors that occur during the request
      console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
      setError(`Login Failed: ${error.message}`);//Set the error state with an error message
    }
  };

  //useEffect hook to for retrieving Login Status and username from sessionStorage
  useEffect(() => {
    // Retrieve login status and username from local storage
    const storedLoginStatus = sessionStorage.getItem('loginStatus');
    const storedUsername = sessionStorage.getItem('username');

    // Conditional rendering to check if both the login status and username are present in sessionStorage.
    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));//If both are present parse the login status from a string to a boolean
      setUsername(storedUsername);//Update the username state with the stored username
    }
  }, []);

  //useEffect hook used to retrieve and update Task Data from Local Storage
  useEffect(() => {
    const storedTasks = sessionStorage.getItem('tasks');  // Retrieve tasks from session storage

    // Conditional rendering to check if the tasks are present in Session storage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
    }
  }, [taskData]);
  /* The useEffect hook takes a second argument, which is an array of dependencies. 
  The [taskData] means that the effect will run whenever the taskData state changes.*/
  
  //Function to add a task
  const addTask = async (taskInput) => {
    try {
      const token = sessionStorage.getItem('token');//Retrieve the authentication from sessionStorage
      // Make a POST request to the server
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',//Request method
        mode: "cors",
        headers: {
          'Content-type': 'application/json',//Specify the content type
          'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
        },
        body: JSON.stringify({ value: taskInput }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // If successful, parse the response JSON and update the taskData state
        const updatedList = await response.json();
        setTaskData(updatedList);

        // Update the local storage with the updated taskData
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');//Log a success message in the console
      } 
      else {
        throw new Error('Failed to add task');//Throw an error message if the POST request is unsuccessful
      }
    } 
    catch (error) {
      console.error('Error adding task:', error.message);//Display a error message in the console for debugging purposes
      setError('Error adding task', error.message);//Set the error state
      sessionStorage.removeItem('token');//Remove the token from local storage if an error occurs.
    }
  };

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a new User
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content tyoe
        },
        // Send the new username and password as JSON in the request body
        body: JSON.stringify({ newUsername, newPassword }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {

        console.log('New user successfully added');// If successful, log a success message and update the session storage with the new user

        const users = JSON.parse(sessionStorage.getItem('users')) || [];// Retrieve existing users from session storage or initialize an empty array
        users.push({ username: newUsername, password: newPassword }); // Add the new user to the array
        sessionStorage.setItem('users', JSON.stringify(users));      // Update the session storage with the updated users array

      } else {
        throw new Error('Failed to add new user');//Throw an error message if the POST request is unsuccessful
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error adding new user', error.message);//Display an error message in the console for debugging purposes
      setError("Error adding new user", error.message);// Sets the error state with an error message.
    }
  };

  //-------------------PUT REQUEST----------------------
  //Function to edit a task
  const editTask = async (taskId) => {//Define an async function to edit a task
    try {
      const token = sessionStorage.getItem('token');// Retrieve the authentication token from session storage
      // Find the task to update based on taskId from the current taskData state
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      // Send a PUT request to the server
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method 
        mode:'cors',
        headers: {
          'Content-type': 'application/json',//Specify the content type
          'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
        },
        body: JSON.stringify({//Send the updated task value as JSON in the request body
          value: taskToUpdate.value,
        }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        console.log('Task successfully updated');//Log a success message in the console
        
        const updatedList = await response.json();// Parse the JSON data from the response  
        setTaskData(updatedList);//Update the taskData state

        sessionStorage.setItem('tasks', JSON.stringify(updatedList));// Update the session storage with the updated taskData

      } else {
        throw new Error('Failed to edit task');//Throw an error if the PUT request is unsuccessful 
      }
    } 
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error editing task:', error.message);//Display an error message in the console for debugging purposes
      setError('Error editing task. Please try again.');//Set the error state with an error message
      sessionStorage.removeItem('token');//Remove the authentication from SessionStorage if an error occurs
    }
  };

  //--------------DELETE REQUEST------------------
  //Function to delete a task
  const deleteTask = async (taskId) => {//Define an async function to delete a task
    try {
      const token = sessionStorage.getItem('token');//Retrieves the authentication token from session storage.
      //Send a DELETE request to the server
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing)
        headers: {
          'Content-type': 'application/json',//Specify the content-type being passed
          'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
        },
      });

      // Conditional rendering if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // If successful, parse the JSON data from the response and update the taskData state
        const updatedList = await response.json();//Parse the JSON data from the response
        setTaskData(updatedList);//Update the TaskData state

        
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));// Update the local storage with the updated taskData
        console.log('Task successfully deleted');//Display a success message in the console
      } 
      else {
        throw new Error('Failed to delete task');//Throw an error message if the DELETE request is unsuccessful
      }
    } 
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set the error state with an error message
      sessionStorage.removeItem('token');// Remove the token from session storage if an error occurs.
    }
  };

//==============EVENT LISTENERS=========================

  // Function to set login status to false, indicating that the user is in the process of logging in
  const appLogin = () => {
    setLoginStatus(false);//Set the loginStatus to false
  };

  // Function to handle logout button click
  const handleLogoutClick = () => {
    // Remove stored login information and trigger logout process
    sessionStorage.removeItem('loginStatus');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    handleLogout(); // Call the handleLogout function
  };

  // Function to perform logout actions
  const logout = () => {
    // Reset login status 
    setLoginStatus(true);
    setLogin(false);

    sessionStorage.removeItem('token');//Remove the stored token
  };

  // Function to reset user credentials and trigger appLogin
  const handleLogout = () => {
    // Reset username and password, and set login status to false
    setUsername('');
    setPassword('');

    // Call appLogin to set login status to false
    appLogin(); 
  };



//==========================JSX RENDERING=========================

  return (
    // AppContianer
    <Container id='appContainer'>
      {/* Header */}
      <Header />
      {loginStatus ? (
        // Section1
        <section id='section1'>
          <div>
            {/* Toggle between the login and registration page */}
            {isRegistration ? (
              // Registration form
              <RegistrationForm
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
               
                addUser={addUser}
              />
            ) : (
              // Login Form
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
            {/* Toggle Button */}
            <ToggleBtn 
            isRegistration={isRegistration} 
            setIsRegistration={setIsRegistration}
            setNewPassword={setNewPassword}
            newPassword={newPassword}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
            />
          </div>
        </section>
      ) : (
        // Section2
        <section id='section2'>
          {/* Form to add new Tasks */}
          <TaskForm addTask={addTask} taskInput={taskInput} setTaskInput={setTaskInput} />
          {error ? (
            <div>{error}</div>
          ) : !isLoaded ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {/* Display the Tasks */}
              {taskData.map((task) => (
                <li key={task.taskId} id='tasks'>
                  <div>
                    {task.taskId}
                  </div>
                  <div>
                    {/* Button to edit a task */}
                    <Button variant="primary" onClick={() => editTask(task.taskId)}>
                      EDIT
                    </Button>
                  </div>
                  <div>
                    {/* Button to Delete a task */}
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
            {/* Button to Logout */}
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
