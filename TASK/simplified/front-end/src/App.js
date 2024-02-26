// Import React and necessary components from Bootstrap
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS File
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';//Import Bootstrap Row
import Col from 'react-bootstrap/Col';//Import bootstrap Colomn
import Button from 'react-bootstrap/Button';//Import bootstrap Button component
//Components
import Login from './components/Login'; // Import the Login component
import Registration from './components/Registration'; // Import the Registration component
import AddTask from './components/AddTask'; // Import the AddTask component
import Header from './components/Header'; // Import the Header component
import ToggleBtn from './components/ToggleBtn'; // Import the ToggleBtn component
import LogoutBtn from './components/LogoutBtn'; // Import the LogoutBtn component

//App function component
export default function App() {//Export default App function component
  //========STATE VARIABLES============
  //Task variables
  const [tasks, setTasks] = useState([]);//State used to store tasks
  const [newTask, setNewTask] = useState({ 
    user: '', 
    title: '' 
  });
  //User variables
  const [userData, setUserData] = useState({ // State variable to store user login credentials
    username: '', 
    password: '' });
  const [newUserData, setNewUserData] = useState({ //State used to store new UserDetails
    newUsername: '', 
    newPassword: '' 
  });
  //Event variables
  const [error, setError] = useState(null);// State variable to store any errors that occur
  const [loggedIn, setLoggedIn] = useState(false);//State to indicate if the user is logged in
  const [loggedOut, setLoggedOut] = useState(true)//State to idicat if the user is logged out
  const [isRegistration, setIsRegistration] = useState(false);//State to indicate whether the user is in registration mode

  //==============USE EFFECT HOOK TO FETCH TASK DATA==============

  useEffect (() => {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetch tasks
      try {
        const token = localStorage.getItem('token')// Retrieve token from localStorage
        //Send a GET request to the /findTasks endpoint
        const response = await fetch ('http://localhost:3001/users/findTasks',{
          method: 'GET',//Request method
          mode: 'cors',//
          headers: {
            'Content-Type': 'application/json',//Specify the Content_Type being passed
            'Authorization': `Bearer ${token}`
          }
        });
//Conditional rendering to check if the response is successful (status code 200-299)
        if (response.ok) {
          const fetchedData = await response.json();// Parse the response data as JSON
          setTasks(fetchedData); // Set the tasks state with the fetched data
          console.log(fetchedData);//Log the fetched data in the console
        } 
        else {
          throw new Error('Failed to fetch tasks');//Throw an error message if the GET request is unsuccessful
        }
      } 
      catch (error) {
        setError(`Error fetching data: ${error.message}`);// Set error state if an error occurs 
      }
    }
    // Invoke the fetchTasks function when the component mounts
    fetchTasks()
  },[]);


  //=============REQUESTS=================
  //------------POST REQUESTS--------------------

  //Function to submitLogin
  const submitLogin = async (e) => { // Define an async function to submitLogin 
  e.preventDefault(); // Prevent the default form submission behavior

  try {
    // Send a POST request to the login endpoint
    const response = await fetch('http://localhost:3001/users/login', {
      method: 'POST',//Request method
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify({ // Convert the user data to a JSON string
        username: userData.username, // Get the username from the userData state
        password: userData.password, // Get the password from the userData state
      }),
    });

    //Conditional rendering to check if the response is successful (status code 200-299)
    if (response.ok) { 
      const data = await response.json(); // Parse the response body as JSON
      //Conditional rendering to check if a token is present in the response data
      if (data.token) { 
        // Store the username and token in the local storage
        localStorage.setItem('username', userData.username);
        localStorage.setItem('token', data.token);
        // Update state variables to indicate successful login
        setLoggedIn(true);
        setLoggedOut(false);
        setError(''); // Clear any previous error messages
      } 
      else {
        throw new Error('Invalid server response');// Throw an error if the server response does not contain a token
      }
    } else {
      
      throw new Error('Username or password are incorrect');// Throw an error if the server response indicates incorrect username or password
    }
  } catch (error) {
    // Catch any errors that occur during the login process
    setError(`Login Failed ${error.message}`); // Set error message in state
    console.log(`Login Failed ${error.message}`); // Log the error message to the console for debugging purposes
  }
};

  //Function to add a new user
const addUser = async (e) => {//Define an async function to add a new User
  e.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(e.target)
    const newUserData = {newUsername : formData.get("username"), newPassword: formData.get("password")}
  try {
    // const token = localStorage.getItem('token'); // Retrieve the token from local storage
    // //Conditional rendering to check if the token is available
    // if (!token) {
    //   throw new Error('No token available'); // Throw an error if no token is available
    // }
    
    // Send a POST request to the register endpoint
    const response = await fetch('http://localhost:3001/users/register', {
      method: 'POST',//Request method
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',// Specify the content type as JSON
        // 'Authorization': `Bearer ${token}`, // Include the token in the authorization header
      },
      body: JSON.stringify(newUserData),
      // body: JSON.stringify({ // Convert the new user data to a JSON string
      //   newUsername: newUserData.newUsername, // Get the new username from the newUserData state
      //   newPassword: newUserData.newPassword, // Get the new password from the newUserData state
      // }),
    });

        //Conditional rendering to check if the response is successful (status code 200-299)
    if (response.ok) { 
      const data = await response.json(); // Parse the response body as JSON
      // Conditional rendering to check if a token is present in the response data
      if (data.token) { 
        // Parse the existing users from local storage or initialise an empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        // Create a new user object with username, password, and userId
        const newUser = { username: newUserData.newUsername, password: newUserData.newPassword, userId: users.length + 1 };
        users.push(newUser); // Add the new user object to the users array
        localStorage.setItem('users', JSON.stringify(users)); // Store the updated users array in local storage
      } else {
        throw new Error('Invalid Server Response'); // Throw an error if the server response does not contain a token
      }
    } else {
      const errorData = await response.json(); // Parse the response body as JSON
      throw new Error(errorData.message); // Throw an error with the message from the server response
      // throw new Error('Failed to add new user');
    }
  } catch (error) {
    setError(`Error adding new user: ${error.message}`); // Set error message in state
  }
};

  //Function to add new task
 const addTask = async (newTask) => {//Define an async function to add a new task
  try {
    const token = localStorage.getItem('token'); // Retrieve the authentication token from local storage
    if (!token) {
      throw new Error('No token available'); // Throw an error if no token is available
    }
    
    // Send a POST request to the addTask endpoint
    const response = await fetch('http://localhost:3001/users/addTask', {
      method: 'POST',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json', // Specify the content type as JSON
        'Authorization': `Bearer ${token}`, // Include the token in the authorization header
      },
      body: JSON.stringify({ // Convert the new task data to a JSON string
        user: newTask.user, // Get the user ID from the newTask object
        title: newTask.title, // Get the task title from the newTask object
      }),
    });
    //Conditional rendering to check if the response is successful (status code 200-299)
    if (response.ok) { 
      const newTaskObject = await response.json(); // Parse the response body as JSON
      setTasks(tasks => [...tasks, newTaskObject]); // Add the new task to the tasks state
      console.log('Task added successfully'); // Log a success message 
    } else {
      throw new Error('Failed to add task'); // Throw an error if the POST request is unsuccessful
    }
  } catch (error) {
    setError(`Error adding task: ${error.message}`); // Set error message in state
  }
};




  //=======EVENT LISTENERS===============

  /*Function to set the loggedOut status to false 
  stating that the user is logged in*/
  const appLogin = () => {
    setLoggedOut(false)
  }
  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    setNewUserData({ username: '', password: '' })
    setUserData({ username: '', password: '' })
  }

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false)
    setLoggedOut(true)
    setUserData({username:'', password:''});
  }

  //=========JSX RENDERING================

  return (
    <>
    {/* appBody */}
    <div id='appBody'>
      {loggedOut ? (
         <Container className='appContainer'>
              {isRegistration ? (
              // RegistrationPage
                <div id='register'>
                 {/* Header */}
                  <Header heading='REGISTRATION' />
                  {/* section1 */}
                  <section className='section1'>
                    <Registration
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
                  </section>
                </div>
              ) : (
                // LoginPage
                <div id='login'>
                  {/* Header */}
                  <Header heading="LOGIN" />
                  <section className='section1'>
                    <Login 
                    submitLogin={submitLogin} 
                    userData={userData} 
                    setUserData={setUserData} 
                    appLogin={appLogin} 
                    loggedIn={loggedIn}/>
                  </section>
                </div>
              )}
              {/* Section 2 */}
              <section className='section2'>
                {/* Button to toggle between 
                login and registration page */}
                <ToggleBtn 
                togglePage={togglePage} 
                isRegistration={isRegistration} />
              </section>
            </Container>         
      ):(
            <Container className='appContainer'>
              {/* Header */}
              <Header heading="TO DO LIST" />
              <section className='section1'>
                <AddTask addTask={addTask} 
                newTask={newTask} 
                setNewTask={setNewTask} />
              </section>
              <section className='section2'>
                <Row>
                  <Col>
                    <h3 className='h3'>TASKS</h3>
                  </Col>
                </Row>
                {/* Error message */}
                {error ? (
                  <div>{error && <p>{error}</p>}</div>
                ) : (
                  // Task Output
                  <ul id='taskItem'>
                    {tasks.map((task) => (
                      <li key={task.id} className='taskItem'>
                        <Row className='taskRow'>
                          <Col className='taskCol'>
                            <label className='taskLabelxx'>
                              <p className='labelText'>USER:</p> 
                              <p className='outputText'>{task.user}</p>
                            </label>
                          </Col>
                          <Col className='taskCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>TASK:</p>                            
                            <p className='outputText'>{task.title}</p>
                            </label>
                          </Col>                         
                          <Col className='taskCol'>
                            {/* Edit Button */}
                            <Button variant='primary' type='button' id='editBtn'>
                              EDIT
                            </Button>
                          </Col>
                          <Col className='taskCol'>
                            {/* Delete Button */}
                            <Button variant='danger' type='button' id='deleteBtn'>
                              DELETE
                            </Button>
                          </Col>
                        </Row>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {/* section3 */}
              <section className='section3'>
                <LogoutBtn logout={logout} />
              </section>
            </Container>    
      )}
    </div>
    </>
  )
}
