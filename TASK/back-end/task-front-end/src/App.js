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

//App Function component
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
  const [isLoaded, setIsLoaded] = useState(false);
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
  }, []);//The empty dependency array ([]) means that the useEffect will only run once, after the initial render. 

  //===============REQUESTS=====================
  //------------GET REQUEST------------------
  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = sessionStorage.getItem('token');
        // Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Specify the request method
          mode: 'cors',// Set the mode to 'cors' for cross-origin resource sharing, indicating that the request is a cross-origin request. 
          /*This is relevant when making requests to a different domain, and it enables the browser to 
          include the necessary headers for cross-origin communication.*/
          headers: {
            'Content-Type': 'application/json',//Specify the Content-Type of the request body
            'Authorization': `Bearer ${token}`,// Include the Authorization header with the token
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
        console.error('Error fetching data:');
      }
    }
    fetchTasks();
  }, []);

  //============POST REQUEST================
  //Function to submit login
  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//Specify the request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-Type': 'application/json',/Specify the content-type for the request body 
        },
        body: JSON.stringify({ username, password }),// Convert user credentials to JSON and include in the request body
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
    } catch (error) {
      console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
      setError(`Login Failed: ${error.message}`);//Set the error state with an error message
    }
  };

  //useEffect hook to for retrieving Login Status and username from sessionStorage
  useEffect(() => {
    const storedLoginStatus = sessionStorage.getItem('loginStatus');
    const storedUsername = sessionStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
      setUsername(storedUsername);
    }
  }, []);

   //useEffect hook used to retrieve and update Task Data from Local Storage
  useEffect(() => {
    const storedTasks = sessionStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  //Function to add a task
  const addTask = async (taskInput) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',//Specify the request method
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: taskInput }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error.message);
      setError('Error adding task', error.message);
      sessionStorage.removeItem('token');
    }
  };

  //Function to add a newUser
  const addUser = async () => {//Define an async function to add a new user
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('New user successfully added');
        const users = JSON.parse(sessionStorage.getItem('users')) || [];
        users.push({ username: newUsername, password: newPassword });
        sessionStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to add new user');
      }
    } catch (error) {
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  };

  const editTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem('token');
      const taskToUpdate = taskData.find((task) => task.id === taskId);
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        mode: 'cors',
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
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error.message);
      setError('Error editing task. Please try again.');
      sessionStorage.removeItem('token');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem('token');
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
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task successfully deleted');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Error deleting task. Please try again.');
      sessionStorage.removeItem('token');
    }
  };

  const appLogin = () => {
    setLoginStatus(false);
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem('loginStatus');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    handleLogout();
  };

  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
    sessionStorage.removeItem('token');
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  return (
    <Container id='appContainer'>
      <Header />
      {loginStatus ? (
        <section id='section1'>
          <div>
            {isRegistration ? (
              <RegistrationForm
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                addUser={addUser}
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
