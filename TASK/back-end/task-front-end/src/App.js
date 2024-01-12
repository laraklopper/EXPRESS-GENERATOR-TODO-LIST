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
import TaskForm from './components/TaskForm';//Import TaskForm Function component

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

 //=============USE EFFECT HOOK TO FETCH DATA==================
 
   // Fetch initial data from the server on component mount
   useEffect (() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:3001/users/findTasks',{
          method: 'GET',
          headers:{
            'Content-Type': 'application/json'
          }
        })

              // Conditional rendering to chheck if the response status is within the successful range (200-299)
              if (response.status >= 200 && response.status < 300) {
                const data = await response.json(); // Parse the response body as JSON
                setTaskData(data);// Update the state variable taskData with the fetched data.
                setIsLoaded(true);// Set the isLoaded state to true to indicate that the data has been loaded
              }
              else {
                throw new Error('Failed to fetch tasks');//If the GET request is unsuccessful throw an error message
              }
      
      } 
      catch (error) {
        //Handle any errors that occur during the request
              // console.error('Error fetching data:');//Display an error message in the console for debugging purposes
              setError('Error fetching data:', error.message);//Set the error state using the setError function with an error message
              setIsLoaded(true); // Set the isLoaded state to true to indicate that the data has been loaded
      }
    }
     fetchTasks()//Invoke the callback function
   }, [])//The empty dependency array ([])  ensures that the effect runs only once when the component mounts. 


  //===============REQUEST FUNCTIONS========================
  //-----------------POST REQUESTS----------------------
  //Function to submit login
  const submitLogin = async () => {//Define an async function to submit login
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//Request method
        headers: {//Send the headers for request
          'Content-Type': 'application/json',// Set the content type to indicate that the request body is in JSON format
        },
        body: JSON.stringify({ username, password }),// Convert the login credentials to a JSON string and include it in the request body
      });

      // Conditional rendering to check if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {

        console.log('Successfully logged in');  // Log a success message to the console
        setLogin(true);// Set the login state to true to indicate that the user is logged in

        localStorage.setItem('loginStatus', JSON.stringify(true));  // Store login status and username in local storage for persistence
        localStorage.setItem('username', username);//Store the username in local storage for persistence.
      } else {
        throw new Error('Failed to login');//If the POST request is unsucccessful throw an error
      }
    } catch (error) {
      // If an error occurs during the login process, log the error and set an error state
      console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
      setError('Login Failed', error.message);//Set the error state using the setError function with an error message
    }
  };

  // Check for stored login status and username on component mount
  useEffect(() => {
    // Retrieve stored login status and username from local storage
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    // Conditional rendering to check if both login status and username are stored in local storage
    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));    // Update the login state with the stored login status
      setUsername(storedUsername);    // Update the username state with the stored username
    }
  }, []);

  // Check for stored tasks on component mount or when taskData changes
  // Use effect to update taskData when it changes or on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from local storage
    // Conditional rendering to check if tasks are stored in local storage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// Parse the JSON string and update the taskData state with the stored tasks
    }
  }, [taskData]);

  // Function to add a new task
   const addTask = async (taskInput) => { // Define an async function to add a task
    try {
      // Make an asynchronous HTTP POST request to add a task
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST', // Request method
        headers: {//Set the headers for request
          'Content-type': 'application/json', //Specify the content of the request body
        },
        body: JSON.stringify({ value: taskInput }),// Convert the taskInput to a JSON string and include it in the request body
      });

      // Conditional rendering to check if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();      // Parse the response body as JSON
        setTaskData(updatedList);      // Update the taskData state with the updated list of tasks


        localStorage.setItem('tasks', JSON.stringify(updatedList)); // Store the updated list of tasks in local storage 
        console.log(updatedList);      // Log the updated list to the console


        console.log('Task added successfully');  // Log a success message to the console

      } else {
        throw new Error('Failed to add task');//Throw an error message if the POST request is not successfu
      }
    } catch (error) {
      // Handle errors which occur during the request
      console.error('Error adding task:', error.message);//Display an error message in the console for debugging
      setError('Error adding task', error.message);//Set the error state using the setError function with an error message
    }
  };

  //Function to add newUser
  const addUser = async () => {//Define an async function to add a new user
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        headers: {
          'Content-type': 'application/json',//Specify the data type
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      //Conditional rendering to check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        console.log('New user successfully added');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to add new user');//Throw an error message if the request is unsuccessful
      }
    } catch (error) {
      console.error('Error adding new user', error.message);//Display an error message in the console for debugging purposes
      setError("Error adding new user", error.message);//Set an error message in the error state
    }
  }

  //----------------PUT REQUEST---------------------------
  // Function to edit a task
  const editTask = async (taskId) => {
    try {
      // Find the task to update in the updatedTasks array (assumed to be defined elsewhere in the code)
      const taskToUpdate = updatedTasks.find((task) => task.id === taskId);

      // Send a PUT request to update the task on the server
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT', // Request method
        headers: {// Set the request method
          'Content-type': 'application/json', // Specify the type of data being passed
        },
        body: JSON.stringify({// Convert the taskToUpdate data to a JSON string and include it in the request body
          value: taskToUpdate.value,
        }),
      });

      // Conditional rendering  if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        console.log('Task successfully updated');      // Log a success message to the console
        const updatedList = await response.json();// Parse the response body as JSON

        setTaskData(updatedList);      // Update the taskData state with the updated list of tasks
        localStorage.setItem('tasks', JSON.stringify(updatedList));// Store the updated list of tasks in local storage

      } else {
        throw new Error('Failed to edit task');//Throw an error if the PUT request is unsucessful
      }
    } catch (error) {
      //Error handling for if the request is unsuccessful
      console.error('Error editing task:', error.message);//Display an error message in the console for debugging purposes
      setError('Error editing task. Please try again.');//Set the error state using the setError function with an error message
    }
  };


  //---------------------DELETE REQUEST---------------
  // Function to delete a task
  const deleteTask = async (taskId) => {//Define an async function to delete a task
    try {
      //Send a DELETE request to the server
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        headers: {
          'Content-type': 'application/json',// Specify the type of data being passed
        },
      });

      // Conditional rendering to check if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();      // Parse the response body as JSON

        setTaskData(updatedList);  // Update the taskData state with the updated list of tasks
        localStorage.setItem('tasks', JSON.stringify(updatedList));   // Store the updated list of tasks in local storage for persistence
        console.log('Task successfully deleted');// Log a success message to the console
        setUpdatedTasks([]); // Clear the updatedTasks state
      }
      else {
        throw new Error('Failed to delete task');//Throw an error message if an error occurs during the DELETE request
      }
    }
    catch (error) {
      //Handle errors which occur during the request
      console.error('Error deleting task:', error.message);//Display an error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set the error state using the setError function with an error message
    }
  };


  //===============EVENT LISTENERS=======================

  // Event listener to set loginStatus to false
  const appLogin = () => {
    setLoginStatus(false);
  };

  // Event listener to handle logout click
  const handleLogoutClick = () => {
    // Remove login-related items from local storage
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');

    // Call the handleLogout function
    handleLogout();
  };

  // Function to logout
  const logout = () => {
    // Set loginStatus to true and login to false
    setLoginStatus(true);
    setLogin(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Reset username and password inputs
    setUsername('');
    setPassword('');

    // Call the appLogin function to set loginStatus to false
    appLogin();
  };

  // Event listener to toggle between registration and login pages
  const togglePage = () => {
    // Toggle the isRegistration state to switch between registration and login pages
    setIsRegistration(!isRegistration);

    // Reset input fields when toggling pages
    setNewUsername(''); // Reset new username input
    setNewPassword(''); // Reset new password input
    setUsername('');    // Reset login username input
    setPassword('');    // Reset login password input
  };



  //==============JSX RENDERING=============================

  return (
    // App container
    <Container id='appContainer'>
    {/* Header */}
      <Header />
      {loginStatus ? (
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
        // section 2
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