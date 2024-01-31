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
  //Task variables
  const [taskData, setTaskData] = useState([]);//State to store the array of tasks wind
  //User variables
  const [username, setUsername] = useState('');//State to store the password entered by the user.
  const [password, setPassword] = useState('');//State to store the password entered by the user.
  const [newUsername, setNewUsername] = useState(' ');//State to store newUsername
  const [newPassword, setNewPassword] = useState('');//State to store newPassword
  //Event variables  
  // const [isLoaded, setIsLoaded] = useState(false);//State to indicate whether the data has loaded
  const [error, setError] = useState(null);//State to store any error that may occur during data fetching or operations
  const [login, setLogin] = useState(false);//State to represent the login status
  const [loginStatus, setLoginStatus] = useState(true);//State used to indicate the login status
  const [isRegistration, setIsRegistration] = useState(false);//State to indicate whether the user is using the registration form

  //===============USE EFFECT HOOKS==============
  //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage
    // Conditional rendering to check if the tasks are present in localStorage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
    }
  }, [taskData, setTaskData]);
  /* The useEffect hook takes a second argument, which is an array of dependencies.
  The [taskData] means that the effect will run whenever the taskData state changes.*/

  //===============REQUESTS=====================
  //------------GET REQUEST-----------
//Function to fetchTasks

  const fetchTasks = async () => {//Define a async function to fetch tasks
  try {
    const token = localStorage.getItem('token');/Retrieve the authentication token from localStorage
    //Send a GET request to the server
    const response = await fetch('http://localhost:3001/users/findTasks', {
      method: 'GET',//Request type
      mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
      headers: {
        'Content-Type': 'application/json',//Specify the type of content being passed
        'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
      }
    });
    
// Conditional rendering to check if the server response is in the successful range (200-299)
    if (response.status >= 200 && response.status < 300) {
      const fetchedTasks = await response.json();// Parse the response body as JSON
      setTaskData(fetchedTasks);//Update the taskData state
      console.log('Tasks successfully fetched:', fetchedTasks);
    } else {
      throw new Error('Failed to fetch tasks');//Throw an error message if the GET request is unsuccessful
    }
  } 
  catch (error) {
    // Handle any errors that occur during the request
    setError(`Error fetching data: ${error.message}`);//Set the error state
    console.error(`Error fetching tasks: ${error.message}`);//Display an error message in the console for debugging purposes
  }
};

  //------------POST REQUESTS----------------------

  
  //useEffect hook to for retrieving Login Status and username from localStorage
  useEffect(() => {
    // Retrieve login status and username from local storage
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    // Conditional rendering to check if both the login status and username are present in localStorage.
    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));//If both are present parse the login status from a string to a boolean
      // setUsername(storedUsername);//Update the username state with the stored username
    }
  }, []);

  //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

    // Conditional rendering to check if the tasks are present in localStorage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
    }
  }, [taskData]);
    /* The useEffect hook takes a second argument, which is an array of dependencies. 
  The [taskData] means that the effect will run whenever the taskData state changes.*/
  
  //useEffect hook used to retrieve and update Task Data from localStorage
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

        // Conditional rendering to check if the tasks are present in localStorage
        if (storedTasks) {
            setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
        }
    }, [taskData,setTaskData]);
    /* The useEffect hook takes a second argument, which is an array of dependencies. 
    The [taskData] means that the effect will run whenever the taskData state changes.*/

 

  //-------------------PUT REQUEST----------------------
  //Function to edit a task
  const editTask = async (taskId) => {//Define an async function to edit a task
    try {
      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      // Find the task to update based on taskId from the current taskData state
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      // Send a PUT request to the server
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method 
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
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
        // If successful, log a success message and update the taskData state
        console.log('Task successfully updated');
        
        const updatedList = await response.json();// Parse the JSON data from the response  
        setTaskData(updatedList);//Update the taskData state

        localStorage.setItem('tasks', JSON.stringify(updatedList));// Update the localStorage with the updated taskData

      } 
      else {
        throw new Error('Failed to edit task');//Throw an error if the PUT request is unsuccessful 
      }
    } 
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error editing task:', error.message);//Display an error message in the console for debugging purposes
      setError('Error editing task. Please try again.');//Set the error state with an error message
      localStorage.removeItem('token');//Remove the authentication from localStorage if an error occurs
    }
  };

  //--------------DELETE REQUEST------------------
  //Function to delete a task
  const deleteTask = async (taskId) => {//Define an async function to delete a task
    try {
      const token = localStorage.getItem('token');//Retrieves the authentication token from localStorage.
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


        
        localStorage.setItem('tasks', JSON.stringify(updatedList));// Update the local storage with the updated taskData
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
      localStorage.removeItem('token');// Remove the token from localStorge if an error occurs.
    }
  };


//==========================JSX RENDERING=========================

  return (
    // AppContianer
    <>
    <div id='appBody'>
      <Container id='appContainer'>
        <Header/>
        { loginStatus ? (
            <div>
              <section id='section1'>
                <div>
                  {isRegistration ? (
                    <RegistrationForm
                    newUsername={newUsername}
                    setNewUsername={setNewUsername}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    setError={setError}
                  
                    
                    />
                  ):(
                    <LoginForm
                    login={login}
                    setLoginStatus={setLoginStatus}
                    loginStatus={loginStatus}
                    setLogin={setLogin}
                    setError={setError}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    />
                  )}
                  <ToggleBtn
                  isRegistration={isRegistration}
                  setIsRegistration={setIsRegistration}
                  setNewPassword={setNewPassword}
                  setNewUsername={setNewUsername}
                  newUsername={newUsername}
                  newPassword={newPassword}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  />
                </div>
              </section>
            </div>
          ):(
            <section id='section2'>
              <TaskForm setTaskData={setTaskData} setError={setError} />
            
            {error ? (
              <div>{error}</div>
            ) : !isLoaded? (
              <p>Loading...</p>
            ):(
              <div>
   {/* <Button variant="primary" onClick={() => fetchTasks()}> FETCH TASKS</Button>*/}

                <ul>
                  {taskData.map((task) => (
                    <li key={task.taskId}>
                      <Row>
                        <Col>
                        <label>
                          <p>USER:</p>
                        </label>
                        <p>{task.username}</p>
                        </Col>
                        <Col>
                        <label><p>TASK:</p></label>
                        <p>{task.title}</p>
                        </Col>
                        {/* <Col>
                      <Button variant="primary" onClick={() => editTask(task.taskId)}>
                        EDIT
                      </Button>
                  </Col>
                   <Col>
                      <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                        DELETE
                      </Button>
                   </Col> */}
                      </Row>
                    </li>
                  ))}
                </ul>
              </div>
            )}
                <LogoutBtn
                  setLogin={setLogin}
                  setLoginStatus={setLoginStatus}
                />
                </section>
          )}
      </Container>
    
          </div>
      
       
    </>
  );
}
