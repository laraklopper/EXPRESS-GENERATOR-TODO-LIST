import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {
  //===========STATE VARIABLES=================
  const [taskData, setTaskData] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

  //============USE EFFECT HOOK
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);

  //===============REQUESTS==================
  //------------GET REQUESTS-----------------
  //Function to fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
        //Conditional rendering to check if authentication token is missing
        if (!token) {
            // Handle the case when the token is missing
            setError('Authentication token not found. Please log in.');
            return;
        }
        //send a get request to the server
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
          setTaskData(fetchedData.tasks);
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
            // console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
            setError(`Login Failed: ${error.message}`);//Set the error state with an error message
        }
    };

  
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
    }
  }, []);

    useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks))
    }
  }, [taskData]);
  
  //Function to add a newUser
    const addUser = async () => {//Define an async funciton to add a new User
        try {
            const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
            //Send a POST request to the server
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',//Request method
                mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
                headers: {
                    'Content-type': 'application/json',//Specify the content type
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                },
                //Request body
                body: JSON.stringify({ newUsername, newPassword }),// Send the new username and password as JSON in the request body
                //body: JSON.stringify ({newUsername: newUserData.newUsername, newPassword: newUserData.newPassword}),
            });

            // Conditional rendering to check if the server response is in the successful range (200-299)
            if (response.ok) {
                const data = await response.json()
                if (data.token) {
                    console.log('New user successfully added');// If successful, log a success message and update the localStorage with the new user
                    const users = JSON.parse(localStorage.getItem('users')) || [];// Retrieve existing users from localStorage or initialize an empty array
                    localStorage.setItem('users', JSON.stringify(users));      // Update the localStorage with the updated users array

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
    const addTask = async (taskInput) => {
        try {
            const token = localStorage.getItem('token');//Retrieve the authentication from localStorage
            // Make a POST request to the server
            const response = await fetch('http://localhost:3001/addTask', {
                method: 'POST',//Request method
                mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
                headers: {
                    'Content-type': 'application/json',//Specify the content type
                    'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
                },
                body: JSON.stringigy({ value: taskInput })
                // body: JSON.stringify({ username: newTask.username, title: newTask.title }),
            });

            // Conditional rendering to check if the server response is in the successful range (200-299)
            if (response.status >= 200 && response.status < 300) {
                // If successful, parse the response JSON and update the taskData state
                const updatedList = await response.json();
                setTaskData(updatedList);
                // Update the local storage with the updated taskData
                localStorage.setItem('tasks', JSON.stringify(updatedList));
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
  //----------------DELETE REQUEST---------------------
  //Function to delete a task
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

  //Function to handle input change in the LoginForm
    // const handleLoginChange = (event) => {
    //     const { name, value } = event.target;
    //     setUserData((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }))
    // }

   //Function to handle input change in the taskForm
    // const handleTaskInput = (event) => {
    //     const {name, value} = event.target;
    //     setNewTask ((prevData) => ({
    //         ...prevData,
    //         [name]:value
    //     }))
    // }

  //Function to handle input change in the registrationForm
  // const handleRegistration = (event) => {
    //     const {name, value} = event.target;
    //     //update newTask state based on the input change
    //     setNewUserData ((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }))
    // } 

     // Function to set login status to false, indicating that the user is in the process of logging in
    const appLogin = () => {
        setLoginStatus(false);//Set the loginStatus to false
    };

   // Function to handle logout button click
    const handleLogoutClick = () => {
        // Remove stored login information and trigger logout process
        localStorage.removeItem('loginStatus');//Remove the loginStatus from localStorage 
        localStorage.removeItem('username');//Remove the username from localStorage
        localStorage.removeItem('token'); //Remove the stored token from localStorage

    };

    //Function to trigger logout button
    const logout = () => {
        // Reset login status 
        setLoginStatus(true);
        setLogin(false);

        localStorage.removeItem('token');//Remove the stored token from localStorage
    };

  
 // Function to toggle between registration and login pages
    const togglePage = () => {
        setIsRegistration(!isRegistration); // Toggle the isRegistration state
        setNewUsername(''); // Reset new username input
        setNewPassword(''); // Reset new password input
        setUsername(''); // Reset username input
        setPassword(''); // Reset password input
    };
  //==============JSX RENDERING======================
  
  return (
    <>
      <div id='appBody'>
        <Container id='appContainer'>
          <Header />
          {loginStatus ? (
            <div>
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
                      appLogin={appLogin}
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
          ) : (
            <section id='section2'>
              <TaskForm setTaskData={setTaskData} setError={setError} />

              {error ? (
                <div>{error}</div>
              ) : !isLoaded ? (
                <p>Loading...</p>
              ) : (
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
