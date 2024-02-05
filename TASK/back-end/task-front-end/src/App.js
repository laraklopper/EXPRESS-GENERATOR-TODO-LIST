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
  //User variables
  //String state variables used to store the user's input for login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //String state variables used to store the user's input for new user registration credentials
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);//State variable used to store any error messages that may occur during the API requests
  //Variables used to manage user login 
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  /*Boolean state variable that determines whether the user is in the registration mode and 
  is used to toggle between login and registration forms. */
  const [isRegistration, setIsRegistration] = useState(false);
  //State used to hold the authentication token recieved from the user upon successful login
  const [token, setToken] = useState(null);

  //============USE EFFECT HOOK============
  //useEffect hook used to retrieve and update Task Data from localStorage
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks');
  //   if (storedTasks) {
  //     setTaskData(JSON.parse(storedTasks));
  //   }
  // }, []);


  //============USE EFFECT HOOK TO FETCH TASK DATA============
  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {
      try {
        // const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          return;
        }

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
          // setIsLoaded(true);
          console.log(fetchedData);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } 
      catch (error) {
        setError(`Error fetching data: ${error.message}`);
        // setIsLoaded(true);
        console.error('Error fetching data:');
      }
    }

    fetchTasks();
  }, [token]);
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
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();// Parse the response JSON data
        setToken(data.token)

        console.log('Successfully logged in');// Display a success message in the console

        setLogin(true);// Set the 'login' state to true, indicating that the user is logged in
        setLoginStatus(true);// Set the 'loginStatus' state to true, indicating the overall login status
        localStorage.setItem('loginStatus', JSON.stringify(true));// Store the login status in localStorage as a string
        localStorage.setItem('username', username);// Store the username in localStorage
        localStorage.setItem('token', data.token);// Store the authentication token received from the server in localStorage
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

//  // UseEffect hook to retrieve the login status and username from local storage
  // useEffect(() => {
  //   const storedLoginStatus = localStorage.getItem('loginStatus');
  //   const storedUsername = localStorage.getItem('username');

  //   if (storedLoginStatus && storedUsername) {
  //     setLogin(JSON.parse(storedLoginStatus));
  //   }
  // }, []);

  // //UseEffect hook to retrieve  and update task data from local storage
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks'); // Retrieve tasks from localStorage
  //   // Conditional rendering to check if the tasks are present in localStorage
  //   if (storedTasks) {
  //     setTaskData(JSON.parse(storedTasks)// If present, parse the JSON and update the taskData state
  // )}
  // }, [taskData]);

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a new User
    try {
      // const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
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
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          console.log('New user successfully added');// If successful, log a success message and update the localStorage with the new user
          const users = JSON.parse(localStorage.getItem('users')) || [];// Retrieve existing users from localStorage or initialize an empty array
          localStorage.setItem('users', JSON.stringify(users));      // Update the localStorage with the updated users array
          localStorage.setItem('token', data.token);

        } else {
          throw new Error('Invalid server response')
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
        // body: JSON.stringigy({ value: taskInput })
        body: JSON.stringify({ username: newTask.username, title: newTask.title }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // If successful, parse the response JSON and update the taskData state
        const updatedList = await response.json();
        setTaskData(updatedList);
        // Update the local storage with the updated taskData
        // localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');//Log a success message in the console
      }
      else {
        throw new Error('Failed to add task');//Throw an error message if the POST request is unsuccessful
      }
    }
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error adding task:', error.message);//Display a error message in the console for debugging purposes
      setError('Error adding task', error.message);//Set the error state
      // localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
    }
  };

  //-------------PUT REQUEST---------------------
  //Function to edit a task
  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: taskToUpdate.title, 
        }),
      });
    // Conditional rendering to check if the server response is in the successful range (200-299)
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

  // ----------------DELETE REQUEST---------------------
  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        mode: 'cors',
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

  //===============Event Listeners===========

  // Function to toggle between registration and login pages
  const togglePage = () => {
    setIsRegistration(!isRegistration); 
    setNewUsername(''); 
    setNewPassword(''); 
    setUsername(''); 
    setPassword(''); 
  };

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
