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
  const [taskData, setTaskData] = useState([]);//State to store the array of tasks 
  const [newTask, setNewTask] = useState({//State to store newTaskInput
    username: '',
    title: '',
  })
  //User variables
  const [userData, setUserData] = useState({//State to store userData
    username: '',
    password: '',
  })
  const [newUserData, setNewUserData] = useState({//State to store newUser Data
    newUsername: '',
    newPassword: '',
  })
  const [token, setToken] = useState(null)
  //Event variables  
  const [error, setError] = useState(null);//State to store any error that may occur during data fetching or operations
  const [login, setLogin] = useState(false);//State to represent the login status
  const [loginStatus, setLoginStatus] = useState(true);//State used to indicate the login status
  const [isRegistration, setIsRegistration] = useState(false);//State to indicate whether the user is using the registration form

  //===============USE EFFECT HOOKS==============
  // //useEffect hook used to retrieve and update Task Data from localStorage
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

  //   // Conditional rendering to check if the tasks are present in localStorage
  //   if (storedTasks) {
  //     setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
  //   }
  // }, []);

  //===============REQUESTS=====================
  //------------GET REQUEST-----------
  useEffect(() => {
    //Function to fetchTasks
    const fetchTasks = async () => {//Define a async function to fetch tasks
      try {
        // const token = localStorage.getItem('token');//Retrieve the authentication token from localStorage
        
        // //Conditional rendering to check if the authentication token is not present
        // if (!token) {
        //   //Set an error message and exit the function
        //   setError('Authentication token not found.Please log in.');// Set an the error state with an error message
        //   return
        // }

        //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Request method
          mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
          headers: {//Set the request headers            
            'Content-Type': 'application/json',//Specify the type of content being passed
            'Authorization': token ? `Bearer ${token}`,//Authorization header as the bearer token
          }
        });

        const fetchedTasks = await response.json()

        if(respnse.ok/*(response.status >= 200 && response.status < 300)*/){
          setTaskData(fetchedTasks)
          console.log(fetchedData);
        }
        else {
          throw new Error('Failed to fetch tasks'); //Throw an error message if the GET request is unsuccessful
        }
      
        // Conditional rendering to check if the server response is in the successful range (200-299)
        // if (response.status >= 200 && response.status < 300) {
        //   const fetchedData = await response.json()// Parse the response body as JSON
        //   setTaskData(fetchedData.tasks);//Update the taskData state
        //   console.log(fetchedData.tasks);// Log the fetched tasks data to the console
        // } 
        // else {
        //   throw new Error('Failed to fetch tasks'); //Throw an error message if the GET request is unsuccessful
        // }
      } 
      catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`);//Set the error state
       console.error('Error fetching data:');//Display an error message in the console for debugging purposes
      }
    }
    fetchTasks()
  },[token])
 
  //------------POST REQUESTS----------------------
//Function to submit login
  const submitLogin = async () => {//Define async function to submit login
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-Type': 'application/json',//Specify the content-type for the request body 
        },
        body: JSON.stringify({ username: userData.username, password: userData.password }),// Convert user credentials to JSON format for the request body
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Handle the response
        const data = await response.json();
        setToken(data.token)

        // if (data.token) {
          console.log('Successfully logged in');//Log a message in the console if the login response is successful
          
          setLogin(true);// Set login state to true
          setLoginStatus(true);// Set the 'loginStatus' state to true, indicating the overall login status
          // setTaskData([])

          // fetchTasks()// Call fetchTasks after successful login

        // } else {
        //   throw new Error ('Invalid response from server')
        // }
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

  //useEffect hook to for retrieving Login Status and username from localStorage
  // useEffect(() => {
  //   const storedLoginStatus = localStorage.getItem('loginStatus');
  //   const storedUsername = localStorage.getItem('username');

  //   if (storedLoginStatus && storedUsername) {
  //     setLogin(JSON.parse(storedLoginStatus));
  //     setUserData(storedUsername);
  //   }
  // }, []);

  //useEffect hook used to retrieve and update Task Data from localStorage
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

  //   // Conditional rendering to check if the tasks are present in localStorage
  //   if (storedTasks) {
  //     setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
  //   }
  // }, []);
  //   /* The useEffect hook takes a second argument, which is an array of dependencies. 
  // The [taskData] means that the effect will run whenever the taskData state changes.*/

  //Function to add a new User
  const addUser = async () => {//Define an async funciton to add a new User
    try {
      // const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          // 'Authorization': `Bearer ${token}`,// Include the token in the Authorization header
          'Authorization': token ? `Bearer ${token}`,//Authorization header as the bearer token
        },
        //Request body
        body: JSON.stringify({ newUsername : newUserData.newUsername, newPassword: newUserData.newPassword }),// Send the new username and password as JSON in the request body
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        if (data.token) {
          console.log('New user successfully added');// If successful, log a success message and update the localStorage with the new user
          // const users = JSON.parse(localStorage.getItem('users')) || [];// Retrieve existing users from localStorage or initialize an empty array
          const users= JSON.parse('userData') || []
          // localStorage.setItem('users', JSON.stringify(users));      // Update the localStorage with the updated users array
          // localStorage.setItem('token', data.token);
        } else {
          throw new Error('Invalid server response');
        }
      } 
      else {
        throw new Error('Failed to add new user');//If the POST request is unsuccessful throw an error message
      }
    } 
    catch (error) {
     // Handle any errors that occur during the request
      console.error('Error adding new user', error.message);//Display an error message in the console for debugging purposes
      setError("Error adding new user", error.message);// Sets the error state with an error message
    }
  };

  //Function to add a task
  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token'); //Retrieve the authentication token from localStorage
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',//Request method
        mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
         'Content-type': 'application/json',//Specify the content type
          // 'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
          'Authorization': token ? `Bearer ${token}`,//Authorization header as the bearer token
        },
        //Request body
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

  //------------PUT REQUEST-----------------
  //Function to edit a task
  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          // 'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
          'Authorization': token ? `Bearer ${token}`,//Authorization header as the bearer token
        },
        body: JSON.stringify({
          value: taskToUpdate.value,
        }),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        console.log('Task successfully updated');
        const updatedList = await response.json();
        setTaskData(updatedList);
        // localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');//Throw an error message if the PUT request is unsuccessful
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error editing task:', error.message);//Display a error message in the console for debugging purposes
      setError('Error editing task. Please try again.');//Set the error state
      localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
    }
  };
  //------------DELETE REQUEST-----------------
  const deleteTask = async (taskId) => {//Define an async funciton to Delete a task
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
        },
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task successfully deleted');//Log a success message in the console if the task is successfully deleted
      } else {
        throw new Error('Failed to delete task');//Throw an error message if the DELETE request is unsuccessful
      }
    } 
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set the error state
      // localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
    }
  };

  //==========EVENT LISTENERS=================
  // Function to set login status to false, indicating that the user is in the process of logging in
  const appLogin = () => {
    setLoginStatus(false);//Set the loginStatus to false
  };

  //Function to handle logout buttonclick
  const handleLogoutClick = () => {
    // Remove stored login information and trigger logout process
    localStorage.removeItem('loginStatus');//Remove the loginStatus from localStorage 
    localStorage.removeItem('username');//Remove the username from localStorage
    localStorage.removeItem('token'); //Remove the stored token from localStorage
  };

  // Function to toggle between registration and login pages
  const togglePage = () => {
    setIsRegistration(!isRegistration)// Toggle the isRegistration state
    setNewUserData({newUsername: '', newPassword: ''})//reset the newUserData state
    setUserData({username: '', password: ''})//reset the userData state
  }

  //Function to trigger logout button
  const logout = () => {
    // Reset login status 
    setLoginStatus(true);
    setLogin(false);
    localStorage.removeItem('token');//Remove the stored token from localStorage
  };


//==========================JSX RENDERING=========================

  return (
    // AppContianer
    <>
    {/* AppBody */}
    <div id='appBody'>
      {/* App Container */}
      <Container id='appContainer'>
        {/* Header */}
        <Header/>
        { loginStatus ? (
            <div>
              <section id='section1'>
                <div>
                  {isRegistration ? (
                    // RegistrationForm
                    <RegistrationForm
                    addUser={addUser}
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    />
                  ):(
                    // LoginForm
                    <LoginForm
                    submitLogin={submitLogin}
                    login={login}
                    handleLogoutClick={handleLogoutClick}
                    userData={userData}
                    setUserData={setUserData}
                    appLogin={appLogin}
                    />
                  )}
                  {/* Button to toggle between registration and Login Page */}
                  <ToggleBtn
                  isRegistration={isRegistration}
                  togglePage={togglePage}
                  />
                </div>
              </section>
            </div>
          ):(
            // Section2
            <section id='section2'>
              {/* Form to add new task */}
              <TaskForm 
              addTask={addTask}
              newTask={newTask}
              setNewTask={setNewTask}
              />
            {/* Error Message */}
            {error ? (
              <div>{error}</div>    
            ):(
              <div>
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
                          <p>TASK:</p>
                          </label>
                        <p>{task.title}</p>
                        </Col>
                         <Col className='tasksCol'>
                      <Button variant="primary" onClick={() => editTask(task.taskId)}>
                        EDIT
                      </Button>
                  </Col>
                   <Col className='tasksCol'>
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
            {/* Logout Button */}
                <LogoutBtn
                  logout={logout}
                />
                </section>
          )}
            </Container>
          </div>       
    </>
  );
}
