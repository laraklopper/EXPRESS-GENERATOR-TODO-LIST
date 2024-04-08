// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container'; // Import the Container component from react-bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from './components/Header';// Import the Header component from './components/Header'
import ToggleBtn from './components/ToggleBtn';// Import the ToggleBtn component from './components/ToggleBtn'
import LogoutBtn from './components/LogoutBtn';// Import the LogoutBtn component from './components/LogoutBtn'
import Login from './components/Login';// Import the Login function component from './components/Login'
import Registration from './components/Registration';// Import the Registration component from './components/Registration'
import AddTask from './components/AddTask'; // Import the AddTask component from './components/AddTask'
import UpdateForm from './components/UpdateForm';//Import the UpdateForm component from './components/UpdateForm'

//App function component
export default function App() {//Export default App function component
  //========STATE VARIABLES==============
  //Task variables
  const [tasks, setTasks] = useState([]);// State used to store the list of tasks
  const [newTask, setNewTask] = useState({//State used to store data for adding a new task
    user: '',   // The user associated with the new task
    title: ''   // The title of the new task   
  });
  //User variables
  const [userData, setUserData] = useState({// State used to manage the user login credentials
    username: '',  // The username entered by the user
    password: ''   // The password entered by the user
  });
  const [newUserData, setNewUserData] = useState({//State variable used to store Data about newUsers
    newUsername: '',  // The desired username for the new user
    newPassword: ''   // The desired password for the new user 
  });
  //Variables to edit task details
  const [newUser, setNewUser] = useState('');//State to store the updated use
  const [newTitle, setNewTitle] = useState('');//State to store the updated title
  const [update, setUpdate] = useState(false);//State to manage display of the update form 
  const [taskToUpdate, setTaskToUpdate] = useState(null);// State used to track the ID of the task for the update form
  const [taskAdded, setTaskAdded] = useState(false);// State variable to track task addition
  const [taskRemoved, setTaskRemoved] = useState(false);// State variable to track task removal
  //Event variables
  const [error, setError] = useState(null);//State to handle errors during data fetching
  const [isRegistration, setIsRegistration] = useState(false);// Boolean variable indicating whether the registration page is currently active.
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);// Boolean variable used to track if the user is logged in
  const [loggedOut, setLoggedOut] = useState(true);// Boolean variable used to track whether the user is currently logged out.

  //==========USE EFFECT HOOK TO FETCH TASKDATA==================
  //Fetch tasks from the server when the component mounts
  useEffect(()=> {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetch tasks
      try {
        const token = localStorage.getItem('token');// Retrieve token from localStorage
        // Conditional rendering if token or login status is missing
        if (!token || !loggedIn) {
          return; //Exit the function if the token or login status is missing
        }
        //Send a GET request to the /users/findTasks endpoint
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
            'Authorization': token //Add the Authorization header containing the JWT token
          }
        });
        // Conditional rendering to check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');//Throw an error message if GET request is unsuccessful
        }
        const fetchedData = await response.json();//Parse the response data

        //Conditional rendering to check if tasks exists in the response
        if (fetchedData && fetchedData.tasks) {
          setTasks(fetchedData.tasks);// Update the tasks state with the fetched tasks
          console.log(fetchedData);//Log the fetched data in the console for debugging purpose
        } 
        else {
          throw new Error('Tasks data is missing in the response');// Throw an error if tasks data is missing in the response
        }
        
      } 
      catch (error) {
        setError(`Error fetching tasks: ${error.message}`);// Set error message in the error state
        console.error(`Error fetching tasks: ${error.message}`); //Log an error message in the console for debugging purposes
      }
    }

    // Conditional rendering to check if user is logged in and fetch tasks accordingly
    if (loggedIn === true) {
      fetchTasks();// Fetch tasks if user is logged in
      if (taskToUpdate !== null) {// Conditional rendering to check if there is a task to update
        fetchTasks() // Fetch tasks if there's a task to update
      } 
      else if (taskRemoved) {// Conditional rendering if a task has been removed
        fetchTasks()// Fetch tasks if a task has been removed
      }
      else if (taskAdded) {// Conditional rendering to check if a task has been added
        fetchTasks()// Fetch tasks if a task has been added
      }
    }
  }, [loggedIn, taskToUpdate, taskRemoved, taskAdded])/*Dependency array to specify
  that the effect should re-run whenever any of these dependencies change.*/
  

  //===========REQUESTS=============
  //Function to submitLogin
  const submitLogin = async (e) => {//Define an async function to submitLogin
    e.preventDefault();// Prevent the default form submission behavior
    // console.log('user logged in');//Log a message in the console for debugging purposes
    try {
      // Send a POST request to the server for user login
      const response = await fetch ('http://localhost:3001/users/login', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
        },
        body: JSON.stringify(// Convert user login data to JSON string
          {
            username: userData.username,// Username from input field
            password: userData.password// Password from input field
          }
        ),
      });

      // Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        const data = await response.json();//Parse the data as JSON
        // console.log(data);//Log the response in the console for debugging purposes

        // Store username, token, and login status in localStorage
        localStorage.setItem('username', userData.username);// Store the user's username in the localStorage under the key 'username'
        localStorage.setItem('token', data.token);/* Store the authentication token received 
        from the server in the localStorage under the key 'token'*/
        localStorage.setItem('loggedIn', true); /* Store the login status of the user in the localStorage under the key 'loggedIn'
        Setting it to true indicates that the user is logged in*/

        setLoggedIn(true);//Update the loggedIn state to true
        setError('');//Clear any previous error messages
        setUserData({ username: ' ', password: ' ' })// Clear user data inputs
        
        appLogin();// Call appLogin function
        console.log('User logged in');//Log a message in the console for debugging purposes
      }
      else{
        throw new Error('Username or password are incorrect');//Throw an error message if login fails
      } 
    } 
    catch (error) {
      setError(`Login Failed ${error.message}`);// Set error state with error message
      console.log(`Login Failed ${error.message}`); //Log an error message in the console for debugging purposes
      setLoggedIn(false);// Update loggedIn state to false
    }
  }

  //Function to add a new user
  const addUser = async (e) => {//Define an async function to add a new user
    console.log('register new user');//Log a message in the console for debugging purposes
    e.preventDefault();//Prevent default form submission behaviour
    try {
      //Send a POST request to the register endpoint
      const response = await fetch('http://localhost:3001/users/register',{
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests
        headers: {
          'Content-Type': 'application/json' // Specify the Content-Type being sent in the request payload
        },
        body: JSON.stringify({// Convert data to JSON string and include it in the request body
          username: newUserData.newUsername,// New username from input field
          password: newUserData.newPassword// New password from input field
        }),
      })

      // Condtitional rendering to check if if the response indicates success (status code 200-299)
      if (response.ok) {
        console.log('User successfully registered');//Log an success message in the console for debugging purposes
        setNewUserData({ newUsername: '', newPassword: '' });// Clear new user data inputs
         } 
      else {
        throw new Error('Error adding new user');// Throw an error if the POST request is unsuccessful
      }
    } 
    catch (error) {
      setError(`Error adding new user: ${error.message}`);// Set error message in the error state
      console.error(`Error adding new user: ${error.message}`); //Log an error message in the console for debugging purposes
    }
  }

  
  //Function to add new task
  const addTask = async (e) => {//Define an async function to add a new task
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      //Send a POST request to the addTask endpoint
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',//HTTP request method
        mode: 'cors',// Set the mode to 'cors' to allow cross-origin requests
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
          'Authorization': token,// Pass the JWT token in Authorization header
        },
        body: JSON.stringify({// Convert new task data to JSON string
          user: newTask.user,// User associated with the new task
          title: newTask.title // Title of the new task         
        }),
      });

      // Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        console.log('Task added successfully');// Log a message in the console to indicate successful task addition
        setTaskAdded(true);// Set taskAdded state to true
        console.log(tasks);// Log current tasks state in the console
        setNewTask({user: '', title: ''}) //Clear new data input
      }
      else {
        const errorData = await response.json(); // Parse error response data as JSON
        throw new Error(errorData.message || 'Failed to add task');// Throw error with error message from server or default message
      }
    }
     catch (error) {
      setError(`Error adding task: ${error.message}`);// Set error state with error message
      console.error(`Error adding task: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  };

  //----------PUT REQUEST----------------
  //Function to edit a task
  const editTask = async (taskId) => {//Definne an async function to edit a task
    try {
      // Conditional rendering to check if the token is available
      const token = localStorage.getItem('token');//Retrieve the authentication token from localStorage
      if (!token) {
        throw new Error('No token available');//Throw an error message if the token is not available
      };
      //Send a PUT request to the /editTask endpoint
      const response = await fetch(`http://localhost:3001/users/editTask/${taskId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
          'Authorization': token, // Pass the JWT token in Authorization header
        },
        body: JSON.stringify({// Convert data to JSON string and include it in the request body
          newUser,
          newTitle
        })
      })

      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to update task');//Throw an error message if the PUT request is unsuccessful
      }
      const updatedTask = await response.json();// Parse updated task data as JSON

      setTasks((prevTasks) => // Update tasks state using a function to ensure we have the most up-to-date previous state
        prevTasks.map((task) => // Map over the previous tasks array
          task.id === taskId ? updatedTask : task /* If the task's ID matches the ID of the task to be update (taskId), 
          replace it with the updatedTask, otherwise keep the task as it is*/
        )
      );

      // Clear the new user and new title states
      setNewUser('');
      setNewTitle('');

      setLoggedIn(true);//Set the loggedIn state to true


      console.log('Task successfully updated');//Log a success message in the console for debugging purpose
      console.log(tasks);//Log the updated tasks in console for debugging purposes

    } catch (error) {
      setError(`Error updating task details: ${error.message}`);//Set the error state with an error message
      console.error('Error updating task', error.message);// Log error message in the console for debugging purposes
    }
  }

 //----------DELETE REQUEST-------------
 //Function to delete a task
 const removeTask = async (taskId) => {//Define an async function to remove a task
  try {
    const token = localStorage.getItem('token');// If the token is not available, throw an error
    //Send a DELETE request to the /deleteTask endpoint
    const response = await fetch (`http://localhost:3001/users/deleteTask/${taskId}`, {
      method: 'DELETE',//HTTP request method
      mode: 'cors',// Set the mode to 'cors' to allow cross-origin requests
      headers: {
        'Content-Type': 'application/json', // Specify the Content-Type being sent in the request payload.
        'Authorization': token /// Pass the JWT token in Authorization header
      }
    });

    // Conditional rendering to check if the response indicates success (status code 200-299)
    if (!response.ok) {
      throw new Error('Failed to delete task');//Throw an error message if the the DELETE request is unsuccessful
    }

    console.log('Task successfully removed'); // Log a succemessage indicating successful task removal
    setLoggedIn(true);// Set logged in state to true
    console.log(tasks);// Log current tasks state in the console
    setTaskRemoved(true);// Set taskRemoved state to true
  } 
  catch (error) {
    console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
    setError(`Error deleting task: ${error.message}`);//Set the error state with an error message
  }
 }
  //======EVENT LISTENERS===========
   /*Function to set the loggedOut status to false
  stating that the user is logged in*/
   const appLogin = () => {
     let token = localStorage.getItem('token'); // Retrieve token from localStorage
     //Condtional rendering to check if the token exists
     if (token) {
       setLoggedOut(false);// Set loggedOut state to false, indicating the user is logged in
     }
   }

  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration); // Toggle the value of isRegistration state
    setError('');// Clear any error messages
    if (isRegistration) {// If currently on the registration page
      setNewUserData({ newUsername: '', newPassword: '' });// Clear newUserData form input
    }
    else {// If currently on the login page
      setUserData({ username: '', password: '' });// Clear userData form input
    }
  };

  //Function to toggle the display of the updateForm to edit the task
  const updateTask = (taskId) => {
    setUpdate(!update) // Toggle the value of update state
    setTaskToUpdate(taskId);// Set the task ID to update
  }

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');// Remove token from localStorage
    localStorage.removeItem('username');// Remove username from localStorage
    localStorage.removeItem('loggedIn');// Remove loggedIn status from localStorage
    setLoggedIn(false);// Set loggedIn state to false
    setLoggedOut(true);// Set loggedOut state to true
    setError('');// Clear any error messages
    setUserData({ username: '', password: '' }); // Clear user data inputs
  }

  //===============JSX RENDERING================

  return (
    <>
    {/* App body */}
    {loggedOut ? (
      // AppContainer
      <Container className='appContainer'>
        {isRegistration ? (
          // Registration page
              <Registration
              newUserData={newUserData}
              setNewUserData={setNewUserData}
              addUser={addUser}/>
        ):(
          // Login page
          <div id='loginPage'>                
          {/* Login Form */}
                  <Login
                    submitLogin={submitLogin}
                    userData={userData}
                    setUserData={setUserData}
                    loggedIn={loggedIn}
                  />  
          </div>          
        )}
        <section className='section3'>
          {/* Button to toggle between login and registration page */}
          <ToggleBtn togglePage={togglePage} isRegistration={isRegistration}/>
        </section> 
      </Container>
    ):(
      // App Container 
      <Container className='appContainer'>
        {/* Header */}
       <Header heading='TO DO LIST'/>
        <section className='section1'>      
          {/* Form to add a new task */}
          <AddTask 
          taskData={newTask}
          setNewTask={setNewTask}
          addTask={addTask}/>
        </section>
        <section className='section2'>
          <Row>
            <Col><h3 className='h3'>TASKS</h3></Col>
          </Row>
          {/* Error message */}
          {error ? (
                <Row className='row'>
                  <Col className='col'> 
                    <p id='errorMessage'>{error}</p>
                  </Col>
                </Row>
          ):(
              <div id='taskOutput'>
                {/* Task Output */}
                <ul className='taskItems'>
                  {tasks.map((task) => (
                    <li key={task._id}>
                      <Row className='outputRow'>
                        <Col className='output'>
                        <label className='userLabel'>USER:</label>
                        <p className='outputText'>{task.user}</p>
                        </Col>
                        <Col  className='output'>
                        <label className='taskLabel'>TASK TITLE:</label>
                        <p className='outputText'>{task.title}</p>      
                        </Col>
                    
                        <Col className='outputBtns'>
                        {/* DeleteBtn */}
                        <Button variant="danger" className='deleteBtn' type='button' 
                        onClick={() => removeTask(task._id) }>
                          DELETE
                        </Button>                                          
                        {/* Edit Button */}
                        <Button variant="primary" className='editBtn' 
                        type='button' onClick={() => updateTask(task._id)}>
                            {/* If in update mode for the current car, 
                            show 'EXIT UPDATE', else show 'UPDATE TASK' */}
                          {update && taskToUpdate === task._id ? 'EXIT UPDATE': 'UPDATE TASK'}
                        </Button>
                      </Col>
                    </Row>
                    <div className='edit'>
                    {/*Display the update Task Form */}
                      {update && taskToUpdate === task._id && (
                        <UpdateForm
                        newUser={newUser}
                        setNewUser={setNewUser}
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                        editTask={() => editTask(task._id)}
                        />
                      )}
                    </div>
                    </li>               
                  ))}
                </ul>
              </div>
          )}
        </section>
            <section className='section3'>
              {/* Logout Button */}
             <LogoutBtn logout={logout}/>
            </section>
      </Container>
    )}
    </>
  )
}
