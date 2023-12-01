//Imports the necessary modules and components from React and external libraries
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
//Components
import Header from './components/Header';//Import Header function component
import Form from './components/Form';//Import Form Function component
import LoginForm from './components/LoginForm';//Import Login function component
import TaskList from './components/TaskList';//TaskList function component
import RegistrationForm from './components/RegistrationForm';//Registration Form function component

//App function component
export default function App() {//Export default App Function component
  //================STATE VARIABLES=====================
  const [taskData, setTaskData] = useState([]);//State to store the data fetched from the server 
  const [isLoaded, setIsLoaded] = useState(false);//State to indicate whether the data has been loaded.
  const [error, setError] = useState(null);//Stores any error that occurs during data fetching or other operations.
  const [updatedTasks, setUpdatedTasks] = useState([]);//Stores tasks that have been updated.
  const [login, setLogin] = useState(false);//State used to indicates whether or not the user is logged in.
  const [password, setPassword] = useState('');//Stores the password entered by the user.
  const [username, setUserName] = useState('');//Stores the username entered by the user.
  const [loginStatus, setLoginStatus] = useState(true);//Indicates the login status.
  const [taskInput, setTaskInput] = useState('');//State to store Input
  const [newUsername, setNewUserName] = useState(' ');//State to store newUsername
  const [newPassword, setNewPassword] = useState('');//State tp store newPassword
  const [isRegistration, setIsRegistration] = useState(false);//State to handle registration


  //=========FETCH DATA==================
  // Fetch initial data from the server on component mount
  useEffect(() => {
    //Function to fetch tasks
    async function fetchTasks() {
      try {
        //Fetch task data from the server
        const response = await fetch('http://localhost:3001/findtasks');

        //Conditional rendering to check the 'ok' property of the response object
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');//Throw an error message if the request is unsuccessful
        }

        const data = await response.json();// Parse the JSON data and set the initial term state
        setTaskData(data);
        setIsLoaded(true);//Update the loading status to true
      } catch (error) {
        console.error('Error fetching data:', error.message);//Display error message in the console for debugging purposes
        setError('Error fetching data. Please try again.');//Set an error message in the error state
        setIsLoaded(true);//Update the loading status to true
      }
    }
    fetchTasks();//Invoke fetchTasks callback function
  }, []);// Empty dependency array means this effect runs only once after the initial render

  //===============REQUEST FUNCTIONS========================
  //----------------POST REQUESTS------------------------
  //Function to submit login
  const submitLogin = async () => {
    try {
      //Send a POST request to server
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',//Request method
        headers: {
          'Content-Type': 'application/json',//Type of data being passed
        },
        body: JSON.stringify({ username, password }),
      });

      //Conditional rendering to check the 'ok' property of the response object
      if (!response.ok) {
        throw new Error('Failed to login');//Throw an error message if the POST request is unsuccessful
      }

      console.log('Successfully logged in');
      setLogin(true);
    }
    catch (error) {
      console.error('Login Failed', error.message);//Display an error message in the console for debugging purposes
      setError('Error logging in. Please try again.');//Set an error message in the error state
    }
  };

  //Function to add newUser
  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/addUser', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword })
      })

      if (!response.ok) {
        throw new Error('Failed to add newUser')
      }

      console.log("New user successfully added");


    } catch (error) {
      console.error("Error adding new user", error.message);//Display error message in console for debugging purposes
      setError("Error adding new user", error.message);//Set an error message in the error state
    }
  }

  //Function to addTask
  const addTask = async () => {
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',//Request method
        headers: {
          'Content-type': 'application/json',//Type of data being passed
        },
        body: JSON.stringify({ value: taskInput }),// Convert taskInput to JSON and include it in the request body
      });

      //Conditional rendering to check the 'ok' property of the response object
      if (!response.ok) {
        throw new Error('Failed to add task');//Throw an error message if the POST request is unsuccessful
      }
      // Parse the JSON response to get the updated list of tasks
      const updatedList = await response.json();
      setTaskData(updatedList);      // Update the local state with the new list of tasks

      console.log(updatedList);
      console.log('Task added successfully');// Log a success message to the console


    } catch (error) {
      console.error('Error adding task:', error.message);//Display an error message in the console for debugging purposes
      setError('Error adding task. Please try again.');//Set an error message in the error state
    }
  };
  //----------------PUT REQUEST---------------------------
  //Function to editTask
  const editTask = async (taskId) => {
    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === taskId);
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        headers: {
          'Content-type': 'application/json',//Type of content being passed
        },
        body: JSON.stringify({
          value: taskToUpdate.value,
        }),
      });

      //Conditional rendering to check the 'ok' property of the response object
      if (!response.ok) {
        throw new Error('Failed to edit task');//Throw an error message if the PUT request is unsuccessful
      }

      console.log('Task successfully updated');//Display a success message in the console if the task is successfully updated
    } catch (error) {
      console.error('Error editing task:', error.message);//Display a error message in the console for debugging purposes
      setError('Error editing task. Please try again.');
    }
  };

  //-----------------DELETE REQUEST------------------
  //Function to delete task
  const deleteTask = async (taskId) => {
    try {
      //Send a DELETE request to the server
      const response = await fetch(`http://localhost:3001/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        headers: {
          'Content-type': 'application/json',//Type of data being passed
        },
      });

      //Conditional rendering to check the 'ok' property of the response object
      if (!response.ok) {
        throw new Error('Failed to delete task');//Throw an error message if the DELETE request is unsuccessful
      }

      const updatedList = await response.json();
      setTaskData(updatedList);
      console.log('Task successfully deleted');
      setUpdatedTasks([]);
    }
    catch (error) {
      console.error('Error deleting task:', error.message);//Display a error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set an error message in the error state
    }
  };


  //===============EVENT LISTENERS=======================

  // Toggle function to handle login by setting loginStatus to false
  const appLogin = () => {
    setLoginStatus(false); // Set loginStatus to false to indicate that the user is logged in
  };

  // Toggle Function to handle logout by setting loginStatus to true and resetting the login state
  const logout = () => {
    setLoginStatus(true); // Set loginStatus to true to indicate that the user is logged out
    setLogin(false); // Reset the login state to false, indicating that the user is not logged in
  };

  //Toggle function to toggle between the registration form and the Login page
  const togglePage = () => {
    setIsRegistration(!isRegistration);
  };

  //==============JSX RENDERING=============================
  return (
    <Container id="appContainer">
      <Header />
      <section id='section1'>
        {loginStatus ? (
          <>
            {isRegistration ? (
              <RegistrationForm
                addUser={addUser}
                newUsername={newUsername}
                setNewUserName={setNewUserName}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
              />
            ) : (
              <LoginForm
                submitLogin={submitLogin}
                username={username}
                setUserName={setUserName}
                password={password}
                setPassword={setPassword}
                appLogin={appLogin}
                login={login}
              />
            )}
            <Button variant='primary' onClick={togglePage} id='registrationBtn'>
              {isRegistration ? 'Login Page' : 'Register'}
            </Button>
          </>
        ) : (
          <section id='section2'>
            <Form addTask={addTask} taskInput={taskInput} setTaskInput={setTaskInput} />
            {isLoaded ? (
              <TaskList tasksData={taskData} deleteTask={deleteTask} editTask={editTask} />
            ) : (
              <p>Loading...</p>
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
      </section>
    </Container>
  );
}