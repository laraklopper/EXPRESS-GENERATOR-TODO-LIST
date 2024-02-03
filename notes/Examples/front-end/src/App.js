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
  //Event variables  
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
  }, []);

  //===============REQUESTS=====================
  //------------GET REQUEST-----------
    //Function to fetchTasks
    const fetchTasks = async () => {//Define a async function to fetch tasks
      try {
        const token = localStorage.getItem('token');//Retrieve the authentication token from localStorage
        
        //Conditional rendering to check if the authentication token is not present
        if (!token) {
          //Set an error message and exit the function
          setError('Authentication token not found.Please log in.');// Set an the error state with an error message
          return
        }

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
          const fetchedData = await response.json()// Parse the response body as JSON
          setTaskData(fetchedData.tasks);//Update the taskData state
          console.log(fetchedData.tasks);// Log the fetched tasks data to the console
        } 
        else {
          throw new Error('Failed to fetch tasks'); //Throw an error message if the GET request is unsuccessful
        }
      } 
      catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`);//Set the error state
       console.error('Error fetching data:');//Display an error message in the console for debugging purposes
      }
    }
 
  //------------POST REQUESTS----------------------
//Function to submit login
  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userData.username, password: userData.password }),
      });

      if (response.status >= 200 && response.status < 300) {
        // Handle the response
        const data = await response.json();

        if (data.token) {
          console.log('Successfully logged in');//Log a message in the console if the login response is successful
          setLogin(true);// Set login state to true
          setLoginStatus(true);
          localStorage.setItem('loginStatus', JSON.stringify(true));
          localStorage.setItem('token', data.token);
          setTaskData([])

          fetchTasks()// Call fetchTasks after successful login

        } else {
          throw new Error ('Invalid response from server')
        }
      } 
      else {
        throw new Error('Failed to login');
      }
    } 
    catch (error) {
      console.error(`Login Failed: ${error.message}`);
      setError(`Login Failed: ${error.message}`);
    }
  };

  //useEffect hook to for retrieving Login Status and username from localStorage
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
      setUserData(storedUsername);
    }
  }, []);

  //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

    // Conditional rendering to check if the tasks are present in localStorage
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
    }
  }, []);
  //   /* The useEffect hook takes a second argument, which is an array of dependencies. 
  // The [taskData] means that the effect will run whenever the taskData state changes.*/

  //Function to add a new User
  const addUser = async () => {
    try {
      const token = localStorage.getItem('token');
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername : newUserData.newUsername, newPassword: newUserData.newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        if (data.token) {
          console.log('New user successfully added');
          const users = JSON.parse(localStorage.getItem('users')) || [];
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('token', data.token);
        } else {
          throw new Error('Invalid server response');
        }
      } 
      else {
        throw new Error('Failed to add new user');//If the POST request is unsuccessful throw an error message
      }
    } 
    catch (error) {
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  };

  //Function to add a task
  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newTask.username, title: newTask.title }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');
      }
      else {
        throw new Error('Failed to add task');
      }
    }
    catch (error) {
      console.error('Error adding task:', error.message);
      setError('Error adding task', error.message);
    }
  };

  //------------PUT REQUEST-----------------
  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
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
  //------------DELETE REQUEST-----------------
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
    setIsRegistration(!isRegistration)
    setNewUserData({newUsername: '', newPassword: ''})
    setUserData({username: '', password: ''})
  }

  //Function to triggerLogout Button
  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
    // localStorage.removeItem('token');
  }



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
