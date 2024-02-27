// Import React and necessary components from Bootstrap
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS File
//Bootstrap
import Container from 'react-bootstrap/Container';//Import bootstrap container
import Row from 'react-bootstrap/Row';//Import Bootstrap Row
import Col from 'react-bootstrap/Col';//Import bootstrap Colomn
import Button from 'react-bootstrap/Button';//Import bootstrap Button component
//Components
import Header from './components/Header';// Import the Header component
import LoginForm from './components/LoginForm';// Import the loginForm component
import RegistrationForm from './components/RegistrationForm';// Import the Registration component
import ToggleBtn from './components/ToggleBtn';// Import the ToggleBtn component
import TaskForm from './components/TaskForm';// Import the AddTask component
import LogoutBtn from './components/LogoutBtn';// Import the LogoutBtn component

//App function component
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  //Task Variables
  const [tasks, setTasks] = useState([]);//State used to store tasks
  const [newTask, setNewTask] = useState({ //State used to store details of a newTask
    user: '', // User associated with the new task
    newTaskTitle: '' // Title of the new task
  });
  const [taskToUpdate, setTaskToUpdate] = useState({// State variable to store details of the task to be updated
    updatedUser: '',// Updated user for the task
    updatedTitle: '',// Updated title for the task
  })
  //UserVariable
  const [userData, setUserData] = useState({// State variable to store user login credentials
    username: '',// Username for authentication
    password: ''// Password for authentication
  });
  const [newUserData, setNewUserData] = useState({//State used to store new UserDetails
    newUsername: '',// New username for registration
    newPassword: ''// New password for registration
  });
  //Event Variables
  const [error, setError] = useState(null);// State variable to store any errors that occur
  const [login, setLogin] = useState(false);// State variable to track user login status
  const [loginStatus, setLoginStatus] = useState(true);// State variable to track the status of the login process
  const [loggedIn, setLoggedIn] = useState(false);//State to indicate if the user is logged in
  const [loggedOut, setLoggedOut] = useState(true)//State to indicate if the user is logged out
  const [isRegistration, setIsRegistration] = useState(false);// State variable to track whether the user is in registration mode
  const [token, setToken] = useState(null);// State variable to store the JWT token for authentication

  //============USE EFFECT HOOK TO FETCH TASK DATA============
  // Fetch tasks from the server on component mount
  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetchTasks
      try {
        const token = localStorage.getItem('token');//Retrieve the JWT token from local storage
        //Send a GET request to the server
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',//Request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',//Specify the Content-Type
            'Authorization': `Bearer ${token}`,
          },
        });

        
        if (response.ok) {
          const fetchedData = await response.json();
          setTasks(fetchedData);
          console.log(fetchedData);
        } else {
          throw new Error('Failed to fetch tasks');;
        }
      } catch (error) {
        // Handle any errors that occur during the request
        setError(`Error fetching data: ${error.message}`);
        console.error('Error fetching data:', error);
      }
    }

    if(loggedIn = true && token){
      fetchTasks();//Invoke callback function
    }
    
  }, [token, loggedIn]);

  //----------------POST REQUEST--------------------------

  //Function to submit login
  const submitLogin = async () => {
    console.log("user logged in");
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3001/users/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.token);
            localStorage.setItem('username', userData.username);
            localStorage.setItem('token', data.token);
          // Update state variables to indicate successful login
            setLoggedIn(true);
            setLoggedOut(false);
          // setError('');//Clear previous error messages
            localStorage.setItem('loginStatus', JSON.stringify(true));
            localStorage.setItem('username', userData.username);
            localStorage.setItem('token', data.token);
        } else {
            throw new Error('Failed to login');
        }
    } catch (error) {
        console.error('Login Failed', error.message);
        setError(`Login Failed: ${error.message}`);
    }
};

  //Function to add a newUser
  const addUser = async () => {//Define an async funciton to add a newUser
    console.log('register new user');
    e.preventDefault();
    const formData = new FormData(e.target)
    const newUserData = {newUsername : formData.get("username"), newPassword: formData.get("password")}
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(newUserData);
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          console.log('New user successfully added');
          const users = JSON.parse(localStorage.getItem('users')) || [];
           const newUser = {
                    username: newUserData.newUsername,
                    password: newUserData.newPassword,
                    userId: users.length + 1
                };
          users.push(newUser)// Push the new user object to the existing users array
                
          localStorage.setItem('users', JSON.stringify(users));// Store updated users array in local storage
          localStorage.setItem('token', data.token);// Store the token from the response in local storage

        } 
        else {
          throw new Error('Invalid server response'); // If the response does not contain a token, throw an error
        }
      } 
      else {
        throw new Error('Failed to add new user'); //Throw an error message if the POST request is unsuccessful
      }
    } 
    catch (error) {      
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  };

  //Function to add a task
  const addTask = async (newTask) => {//Define an async funciton to add a new Task
    try {
      const token = localStorage.getItem('token')
      const token = ''; 
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          user: newTask.user, 
          title: newTask.newTaskTitle 
        }),
      });
      
      if (response.ok) {
        const updatedList = await response.json();
        setTasks(updatedList);
        console.log('Task added successfully');      

        setNewTask({ user: '', title: '' });
        localStorage.setItem('tasks', JSON.stringify(updatedList));
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
  //-------------PUT REQUEST---------------------
  // Function to edit a task
  const editTask = async (taskId) => {//Define an async function to edit tasks
    try {
      const token = '';
      const token = localStorage.getItem('token');
      // const taskToUpdate = tasks.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskToUpdate),
        // body: JSON.stringify({value: taskToUpdate.title,}),
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.ok) {
        console.log('Task successfully updated');
        const updatedList = await response.json();
        setTasks(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } 
      else {
        throw new Error('Failed to edit task');
      }
    } 
    catch (error) {
    console.error('Error editing task:', error.message);
    setError('Error editing task. Please try again.');
    localStorage.removeItem('token');
    }
  };

  // ----------------DELETE REQUEST---------------------
  // Function to delete a task
  const deleteTask = async (taskId) => {//Definc an async function to delete a task
    try {
      // const token = '';
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedList = await response.json();
        setTasks(updatedList);
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

/*Function to set the loggedOut status to false 
  stating that the user is logged in*/
  const appLogin = () => {
    setLoggedOut(false)
  }

  //Function to toggle between Registration and logout page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    setNewUserData({ newUsername: '', newPassword: '' })
    setUserData({ username: '', password: '' })
  }

 //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false)
    setLoggedOut(true)
    setUserData({username:'', password:''});
  }



  //===========JSX RENDERING==================

  return (
    <>
    {/* App Body */}
      <div id='appBody'>
        {/* App container */}
        <Container id='appContainer'>
          {/* Header */}
          <Header />
          {loggedOut ? (
            <Container className="appContainer">
            {isRegistration ? (
              <div id="registration"/>
                {/* Header */}
                <Header heading='REGISTRATION' />
            {/* section1 */}
            <section className="section1">
             <RegistrationForm
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
            </section>
            ): (
              <div> {/* Header */}
                  <Header heading="LOGIN" />
                  <section className='section1'>
             <LoginForm
                      loggedIn={loggedIn}
                      submitLogin={submitLogin}
                      appLogin={appLogin}
                      // handleLogoutClick={handleLogoutClick}
                      userData={userData}
                      setUserData={setUserData}
                    />
            </section>
                </div>
            )}
            <div>
                  )}
                
                 {/* Section 2 */}
              <section className='section2'>
                 {/* Button to toggle between the login and registration page */}
                <ToggleBtn 
                togglePage={togglePage} 
                isRegistration={isRegistration} />
              </section>
            </Container>  
            </div>
          ) : (
            <Container className='appContainer'>
            {/* Header */}
              <Header heading="TO DO LIST" />
                {/* section1 */}
            <section className="section1">
                  {/* Form to add a new task */}
              <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
                </section>
              {/* section 2 */}
                <section className="section2">    
                  <Row>
                  <Col>
                    <h3 className='h3'>TASKS</h3>
                  </Col>
                </Row>
                {/* Error Message */}
              {error ? (
                  <div>{error && <p>{error}</p>}</div>
                ) : (
                <div>
                  {/* Task output */}
                  <ul id='taskList'>
                    {tasks.map((task) => (
                      <li key={task.taskId} className='taskItem'>
                        <Row className='taskOutputRow'>
                          <Col className='tasksCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>USER:</p> 
                              <p className='outputText'>{task.user}</p>
                            </label>
                            <p className='outputText'>{task.username}</p>
                          </Col>
                          <Col className='taskCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>TASK:</p>                            
                            <p className='outputText'>{task.title}</p>
                            </label>
                          </Col> 
                        </Row>
                        <Row className='taskOutputRow'>
                          <Col className='tasksCol'>
                            {/* Button to edit a task */}
                            <Button variant="primary" onClick={() => editTask(task.taskId)}>
                              EDIT
                            </Button>
                            <label>
                              <p className='labelText'>UPDATE USER</p>
                              <input
                                value={taskToUpdate.updatedUser}
                                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, updatedUser: e.target.value })}
                                type='text'
                              />
                            </label>
                          </Col>
                          <Col className="taskCol">
                            <label>
                              <p className='labelText'>UPDATE USER</p>
                              <input
                                value={taskToUpdate.updatedTitle}
                                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, updatedTitle: e.target.value })}
                                type='text'
                              />
                            </label>
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
            </section>
                {/* section3 */}
              <section className='section3'>
                {/* Logout button */}
                <LogoutBtn logout={logout} />
              </section>
          )}
        </Container>
      </div>
    </>
  );
}
