// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import './App.css'
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from './components/Header'; 
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';
import Login from './components/Login';
import Registration from './components/Registration';
import AddTask from './components/AddTask'; 
import UpdateForm from './components/UpdateForm'

//App function component
export default function App() {//Export default App function component
  //========STATE VARIABLES==============
  //Task variables
  const [tasks, setTasks] = useState([]);// State variable to store tasks
  const [newTask, setNewTask] = useState({// State variable to store new task data
    user: '',   
    title: ''   
  });
  //User variables
  const [userData, setUserData] = useState({   // State variable to store user data
    username: '',  
    password: ''  
  });
  // Variables to edit task details
  const [newUserData, setNewUserData] = useState({ // State variable to store new user data for registration
    newUsername: '',  
    newPassword: ''   
  });
  //Variables to edit task details
  const [newUser, setNewUser] = useState(''); // State variable to store new user data for task update
  const [newTitle, setNewTitle] = useState(''); // State variable to store new task title for task update
  const [update, setUpdate] = useState(false); // State variable to control task update mode
  const [taskToUpdate, setTaskToUpdate] = useState(null); // State variable to store task to be updated
  const [taskAdded, setTaskAdded] = useState(false);// State variable to track task addition
  const [taskRemoved, setTaskRemoved] = useState(false):// State variable to track task removal
  //Event variables
  const [error, setError] = useState(null);// State variable to store error messages
  const [isRegistration, setIsRegistration] = useState(false);// State variable to control registration mode
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);// State variable to track user login status
  const [loggedOut, setLoggedOut] = useState(true);// State variable to track user logout status

  //==========USE EFFECT HOOK TO FETCH TASKDATA==================
  //Fetch tasks from the server when the component mounts
  useEffect(()=> {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetch tasks
      try {
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) {
          return; 
        }
        //Send a GET request to the /users/findTasks endpoint
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token 
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const fetchedData = await response.json();

        
        if (fetchedData && fetchedData.tasks) {
          setTasks(fetchedData.tasks);
          console.log(fetchedData);
        } 
        else {
          throw new Error('Task data is missing in the response');
        }
        
      } 
      catch (error) {
        setError(`Error fetching tasks: ${error.message}`);
        console.error(`Error fetching tasks: ${error.message}`); 
      }
    }
    //Conditional rendering to check if the user is logged in 
    if (loggedIn === true) {
    fetchTasks();// Fetch tasks when the component mounts or when user logs in
  	if(taskToUpdate !== null ){//Conditional rendering to display tasks after a task is edited
        fetchTasks();// Fetch tasks when a task is updated
      }
      else if(taskRemoved){//Conditional rendering to display tasks after a task is removed
        fetchTasks(); // Fetch tasks when a task is removed
      }    
      else if(taskAdded){//Conditional rendering to display tasks after a task is added
        fetchTasks();// Fetch tasks when a task is added
      }
    }
  }, [loggedIn,taskToUpdate, taskRemoved, taskAdded])
  /*Dependencies array for the */

  //===========REQUESTS=============
  //Function to submitLogin
  const submitLogin = async (e) => {//Define an async function to submitLogin
    e.preventDefault();
    try {
      // Send a POST request to the server for user login
      const response = await fetch ('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            username: userData.username,
            password: userData.password
          }
        ),
      });
      
      if (response.ok) {
        const data = await response.json();
       
        localStorage.setItem('username', userData.username)
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', true); 

        setLoggedIn(true);
        setError('');
        setUserData({username: ' ', password: ' '})
        
        appLogin()

        console.log('User logged in');
      }
      else{
        throw new Error('Username or password are incorrect');
      } 
    } 
    catch (error) {
      setError(`Login Failed ${error.message}`);
      console.log(`Login Failed ${error.message}`); 
      setLoggedIn(false);
    }
  }

  //Function to add a new user
  const addUser = async (e) => {//Define an async function to add a new user
    console.log('register new user');
    e.preventDefault();
    try {
      //Send a POST request to the register endpoint
      const response = await fetch('http://localhost:3001/users/register',{
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          password: newUserData.newPassword
        }),
      })

      if (response.ok) {
        console.log('User successfully registered');
         } 
      else {
        throw new Error('Error adding new user');
      }
    } 
    catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`);
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
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          user: newTask.user,
          title: newTask.title         
        }),
      });

      if (response.ok) {
        console.log('Task added successfully');
        setTaskAdded
        console.log(tasks);
      }
      else {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Failed to add task');
      }
    }
     catch (error) {
      setError(`Error adding task: ${error.message}`);
      console.error(`Error adding task: ${error.message}`);
    }
  };

  //----------PUT REQUEST----------------
  //Function to edit a task
  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      };
      //Send a PUT request to the /editTask endpoint
      const response = await fetch(`http://localhost:3001/users/editTask/${taskId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, 
        },
        body: JSON.stringify({
          newUser,
          newTitle
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? updatedTask : task 
        )
      );

      // setUpdate(false)
      setNewUser('');
      setNewTitle('');

      setLoggedIn(true)
      console.log('Task successfully updated');
      console.log(tasks);
      setTaskRemoved

    } catch (error) {
      console.error('Error updating task', error.message);
      setError(`Error updating task details: ${error.message}`);
    }
  }

 //----------DELETE REQUEST-------------
 //Function to delete a task
 const removeTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    //Send a DELETE request to the /deleteTask endpoint
    const response = await fetch (`http://localhost:3001/users/deleteTask/${taskId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    console.log('Task successfully removed');
    setLoggedIn(true);
    console.log(tasks);
  } 
  catch (error) {
    console.error('Error deleting task:', error.message);
    setError(`Error deleting task: ${error.message}`);
  }
 }
  //======EVENT LISTENERS===========
   /*Function to set the loggedOut status to false
  stating that the user is logged in*/
   const appLogin = () => {
     let token = localStorage.getItem('token');
     if (token) {
       setLoggedOut(false);
     }
   }

  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration); 
    setError('');
    if (isRegistration) {
      setNewUserData({ newUsername: '', newPassword: '' });
    } else {
      setUserData({ 
        username: '', 
        password: '' 
      });
    }
  };


  //Function to toggle the display of the updateForm to edit the task
  const updateTask = (taskId) => {
    setUpdate(!update)
    setTaskToUpdate(taskId)
  }

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn')
    setLoggedIn(false);
    setLoggedOut(true)
    setError('');
    setUserData({ 
      username: '', 
      password: '' 
    });
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
                        <Col xs={6} md={4} className='output'>
                        <label className='userLabel'>USER:</label>
                        <p className='outputText'>{task.user}</p>
                        </Col>
                        <Col xs={6} md={4} className='output'>
                        <label className='taskLabel'>TASK TITLE:</label>
                        <p className='outputText'>{task.title}</p>      
                        </Col>
                        <Col></Col>
                        </Row>
                        <Row className='buttonRow' >
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
