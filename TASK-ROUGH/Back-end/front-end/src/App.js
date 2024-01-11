import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
//Components
import Header from './components/Header';//Import Header function component
import Login from './components/Login';//Import Login function component
import Registration from './components/Registration';//Import Registration function component
import TaskForm from './components/Form';//Import the Taskform function component


//App function component
export default function App() {//Export default App Function component
  //===========STATE VARIABLES=======================
  //User variables
  const [username, setUsername] = useState('');//State used to store the username entered by the user.
  const [password, setPassword] = useState('');//State used to store the password entered by the user
  const [newUsername, setNewUsername] = useState('');//State used to store newUsername
  const [newPassword, setNewPassword] = useState('');//State to store newPassword
  //Task Variables
  const [taskData, setTaskData] = useState([]);//State to store the data fetched from the server 
  const [taskInput, setTaskInput] = useState(' ');//State to store task Input
  //Event variables  
  const [error, setError] = useState(null);//State to any error that occurs during data fetching or other operations.
  const [login, setLogin] = useState(false);//State used to indicates whether or not the user is logged in.
  const [isRegistration, setIsRegistration] = useState(false);//State to handle registration

  //=============USE EFFECT HOOK TO FETCH DATA==================
  // Fetch initial data from the server on component mount
  useEffect(() => {
    async function fetchTasks() {//Define an async function to fetch tasks
      try {
      //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Request method
          headers: {//Send the headers for request
            'Content-Type': 'application/json',//Specify the content of the request body
          },
        });

        // Conditional rendering to check if the response status is within the successful range (200-299)
        if (response.status >= 200 && response.status < 300) {
          const data = await response.json();// Parse the response body as JSON
          setTaskData(data);// Update the state variable taskData with the fetched data.
        } 
        else {
          throw new Error('Failed to fetch tasks'); //Throw an error message if the GET request is unsuccessful
        }
      } 
      catch (error) {
        // Handle any errors that occur during the request
        // console.error('Error fetching data:');//Display an error message in the console for debugging purposes
        setError('Error fetching Tasks: ' + error.message);//Set the error state using the setError function with an error message
      }
    }
    fetchTasks();//Invoke the callback function
  }, []);//The empty dependency array ([])  ensures that the effect runs only once when the component mounts.

  //===============REQUEST FUNCTIONS========================
  //-----------------POST REQUESTS----------------------
  //Function to submit login
  const submitLogin = async () => {//Define an async function to submit login
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//Request method
        headers: {//Send the headers for the request
          'Content-Type': 'application/json',//Specify the content of the request body
        },
        body: JSON.stringify({ username, password }),// Convert the login credentials to a JSON string and include it in the request body
      });

      // Conditional rendering to check if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // console.log('Successfully logged in');  // Log a success message to the console
        setLogin(true);// Set the login state to true to indicate that the user is logged in
        localStorage.setItem('loginStatus', JSON.stringify(true));// Store login status and username in local storage
        localStorage.setItem('username', username);//Store the username in local storage
      } 
      else {
        throw new Error('Failed to Login');//If the POST request is unsucccessful throw an error message
      }
    } 
    catch (error) {
      //Handle any errors that occur during the request
      // console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
      setError('Login Failed: ' + error.message);//Set the error state using the setError function with an error message
    }
  };

  // Check for stored login status and username on component mount
  useEffect(() => {
    // Retrieve stored login status and username from local storage
    const storedLoginStatus = localStorage.getItem('loginStatus');//Login Status
    const storedUsername = localStorage.getItem('username');//username

    // Conditional rendering to check if both login status and username are stored in local storage
    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));// Update the login state with the stored login status
      setUsername(storedUsername); // Update the username state with the stored username
    }
  }, []);

  // Check for stored tasks on component mount or when taskData changes
  // Use effect to update taskData when it changes or on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');// Retrieve tasks from local storage

    // Conditional rendering to check if tasks are stored in local storage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// Parse the JSON string and update the taskData state with the stored tasks
    }
  }, [taskData]);

  //Function to add a new task
  const addTask = async (taskInput) => {//Define an async function to add a newTask
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',//Request method
        headers: {//Send the headers for the request
          'Content-Type': 'application/json',//Specify the content of the request body
        },
        body: JSON.stringify({ value: taskInput }),// Convert the taskInput to a JSON string and include it in the request body
      });

      // Conditional rendering to check if the response status is within the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');
      } 
      else {
        throw new Error('Failed to add task'); //Throw an error message if the POST request is not successful
      }
    } 
    catch (error) {
      // Handle errors which occur during the request
      setError('Error adding task: ' + error.message);//Set the error state using the setError function with an error message
    }
  };

  //Function to add a user
  const addUser = async () => {//Define async function to add a User
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        headers: {
          'Content-type': 'application/json',//Specify the content of the request body
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
      // Handle errors which occur during the request
      setError('Error adding new user: ' + error.message);//Set the error state using the setError function with an error message
      // console.error('Error adding new user: ' + error.message);//Display error message in the console for debugging purpose
    }
  };

 //----------------PUT REQUEST--------------------------------- 
  //Function to edit a Task
  const editTask = async (taskId) => {//Define async function to edit a task
    try {
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        headers: {
          'Content-type': 'application/json',
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
    }
  };
//-------------DELETE REQUEST----------------------
//Function to delete a task
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
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      setError('Error deleting task: ' + error.message);
    }
  };

  //===============EVENT LISTENERS=======================
  // Event listener to set loginStatus to false
  const appLogin = () => {
    setLogin(false);
  };

  // Event listener to handle logout click
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    // Call the handleLogout function
    handleLogout();
  };

  const logout = () => {
    setLogin(false);
  };

  
  const handleLogout = () => {
    // Reset username and password inputs
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

  //=====================JSX RENDERING=====================
  return (
    // app container
    <Container id='appContainer'>
      {/* Header */}
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
                <p>No tasks available.</p>
              ) : (
                <ul>
                  {taskData.map((task) => (
                    <li key={task.taskId} id='tasks'>
                      <div>{task.taskId}</div>
                      <div>
                        {/* Button to edit a task */}
                        <Button variant='primary' onClick={() => editTask(task.taskId)}>
                          EDIT
                        </Button>
                      </div>
                      <div>
                        {/* Button to delete a Task */}
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
          <Row>
            <Col>
              <Button variant='primary' onClick={logout}>
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
