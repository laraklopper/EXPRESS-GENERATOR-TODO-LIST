import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function App() {
  // ==========STATE VARIABLES======================
  // --------Task variables------------
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({
    username: '',
    title: '',
  });

  // ---------User variables-------------
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newPassword: '',
  });
  // --------Event variables----------------
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

  // ==========USE EFFECT HOOK===============
  // useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from local storage
    //Conditional rendering to check if there are any stored tasks in local storage
    if (storedTasks) {
      // If tasks are found in local storage, parse and set them as the initial state
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);

  // ===============REQUESTS=====================
  // ------------GET REQUEST-----------
//Function to fetch tsk
  const fetchTasks = async () => {//Define an async function to fetch the task
    try {
      const token = localStorage.getItem('token'); // Retrieve the user's token from local storage
      //Send a GET request to the server
      const response = await fetch('http://localhost:3001/users/fetchTasks', {
        method: 'GET',//Request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
    // Conditional rendering to check if the response from the server is successful (status code 200-299)
      if (response.ok) {
        const fetchedTasks = await response.json();// Parse the response body as JSON
        setTaskData(fetchedTasks);      // Update the component state with the fetched tasks
        console.log(fetchedTasks);      // Log the fetched tasks in the console for debugging purposes

      } else {
        throw new Error('Failed to fetch tasks');//Throw a error message if the GET request is unsuccessful
      }
    } catch (error) {
      setError(`Error fetching data : ${error.message}`);//If an error occurs update the error state and display an error message
      console.error(`Error fetching data : ${error.message}`);//Display an error message in the console for debugging purposes
    }
  };

  // ------------POST REQUESTS----------------------
  // Function to submit login
  const submitLogin = async () => {
    try {
      //Send a POST request to the login endpoint
      const response = await fetch(`http://localhost:3001/users/login`, {
        method: 'POST',//Request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the content-type being passed
        },
        body: JSON.stringify({ username: userData.username, password: userData.password }),
      });

      // Conditional rendering to check if the login request was successful 
      if (response.ok) {
        const data = await response.json();//Parse the response body as JSON
      // Conditional rendering to check if a token is present in the response data
        if (data.token) {
          console.log('Successfully logged in');
          setLogin(true);//Update the login State to true
          setLoginStatus(true);//Update the LoginStatus to true 
          //Store the data in local storage
          localStorage.setItem('loginStatus', JSON.stringify(true));
          localStorage.setItem('userData', data.token);
          localStorage.setItem('token', data.token);
          setTaskData([]);//Clear the existing tasks

          //Invoke the fetch tasks callback function
          fetchTasks()//Fetch the tasks 
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Failed to Login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);//Log an error message in the console for debuggig purposes
      setError(`Login Failed ${error.message}`);//If an error occurs update the error state and display an error message
    }
  };

  // Function to add User
 const addUser = async () => {
  try {
    const token = localStorage.getItem('token');// Retrieve the user's token from local storage
    // Make a POST request to the server's 'register' endpoint
    const response = await fetch('http://localhost:3001/user/register', {
      method: 'POST',//Request method
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the user's token in the request headers
      },
      body: JSON.stringify({
        newUsername: newUserData.newUsername,
        newPassword: newUserData.newPassword,
      }),
    });

    // Conditional rendering to check if the registration request was successful (status code 200-299)
    if (response.ok) {
      // Parse the response body as JSON
      const data = await response.json();

      // Conditional rendering to check if a token is present in the response data
      if (data.token) {
        console.log('New User successfully added');//Log a success message in the console if the new user is successfully added
        // Get existing users from local storage or initialize an empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Update the list of users 
        localStorage.setItem('users', JSON.stringify(users)); //The current implementation is storing an empty array in local storage
      } else {
        throw new Error('Invalid server response');// Throw an invalid reponse from the server if no token is found 
      }
    } else {
      throw new Error('Failed to add new user');//Throw an error message if the POST request is unsuccessful
    }
  } catch (error) {
    // Handle any errors that occur during the user registration process
    console.error('Error adding new user', error.message);//Log an error message in the console for debugging purposes
    setError(`Error adding new user ${error.message}`);//If an error occurs update the error state and display an error message
  }
};

  // Function to addNew task
const addTask = async () => {
  try {
    // Get the user's token from local storage
    const token = localStorage.getItem('token');

    // Make a POST request to the server's 'addTask' endpoint
    const response = await fetch('http://localhost:3001/users/addTask', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the user's token in the request headers
      },
      body: JSON.stringify({ username: newTask.username, title: newTask.title }),
    });

    // Conditional rendering if the task addition request was successful (status code 200-299)
    if (response.ok) {
      
      const updatedList = await response.json();// Parse the response body as JSON

      setTaskData(updatedList);      // Update the component state with the updated list of tasks


      // Store the updated list of tasks in local storage
      localStorage.setItem('tasks', JSON.stringify(updatedList));

     
      console.log('Task added successfully'); // Log a success message to the console
    } else {
      throw new Error('Failed to add new Task');//Throw an error message if the POST request is unsuccessful
    }
  } catch (error) {
    // Handle any errors that occur during the task addition process
    setError(`Error adding task ${error.message}`);
    console.error('Error adding task:', error.message);//Log an error message

   
    localStorage.removeItem('token'); // Remove the user's token from local storage 
  }
};


  // ==========EVENT LISTENERS=====================

  const appLogin = () => {
    setLoginStatus(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTaskInput = (event) => {
    const { name, value } = event.target;
    setNewTask((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUserData({ newUsername: '', newPassword: '' });
    setUserData({ username: '', password: '' });
  };

  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
    localStorage.removeItem('token');
  };

  // ===========JSX RENDERING==================

  return (
    <>
      <div id='appBody'>
        <Container>
          <header id='header'>
            <Row>
              <Col>
                <h1 className='h1'>TO DO LIST</h1>
              </Col>
            </Row>
          </header>
          {loginStatus ? (
            <section id='section1'>
              {isRegistration ? (
                <div id='Registration'>
                  <Row className='regisRow'>
                    <Col className='regisCol'>
                      <h2 className='h2'>REGISTRATION</h2>
                    </Col>
                    <form onSubmit={addUser}>
                      <Row className='regisRow'>
                        <Col xs={6} md={4} className='regisRow'>
                          <label className='regisLabel'>
                            <p className='labelText'>USERNAME:</p>
                            <input
                              type='text'
                              name='newUsername'
                              value={newUserData.newUsername}
                              onChange={handleRegistrationChange}
                              className='regisInput'
                              placeholder='username'
                            />
                          </label>
                        </Col>
                        <Col xs={6} md={4} className='regisCol'>
                          <label className='regisLabel'>
                            <p className='labelText'>PASSWORD:</p>
                            <input
                              type='text'
                              name='newPassword'
                              value={newUserData.newPassword}
                              onChange={handleRegistrationChange}
                              className='regisInput'
                              placeholder='password'
                            />
                          </label>
                        </Col>
                        <Col xs={6} md={4} className='regisCol'>
                          <Button variant='primary' type='submit' id='registrationBtn'>
                            REGISTER
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row>
                    <Col>
                      <h2>LOGIN</h2>
                    </Col>
                  </Row>
                  <form onSubmit={submitLogin}>
                    <Row className='loginRow'>
                      <Col xs={6} md={4}>
                        <label>
                          <p className='labelText'>USERNAME:</p>
                          <input
                            type='text'
                            name='username'
                            value={userData.username}
                            onChange={handleLoginChange}
                            className='loginInput'
                            autoComplete='on'
                            placeholder='username'
                          />
                        </label>
                      </Col>
                      <Col xs={6} md={4}>
                        <label>
                          <p className='labelText'>PASSWORD:</p>
                          <input
                            type='text'
                            name='password'
                            value={userData.password}
                            onChange={handleLoginChange}
                            className='loginInput'
                            autoComplete='on'
                            placeholder='password'
                          />
                        </label>
                      </Col>
                      <Col xs={6} md={4} className='loginCol'>
                        <Button variant='primary' type='submit' onClick={login ? handleLogoutClick : appLogin}>
                          LOGIN
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </div>
              )}
              <Row id='pageToggleRow'>
                <Col id='pageToggleBtn'>
                  <Button variant='primary' type='submit' id='toggleBtn' onClick={togglePage}>
                    {isRegistration ? 'Login Page' : 'Registration Page'}
                  </Button>
                </Col>
              </Row>
            </section>
          ) : (
            <section id='section2'>
              <div id='form'>
                <Row className='formRow'>
                  <Col className='formCol'>
                    <h2 className='h2'>ADD TASK</h2>
                  </Col>
                </Row>
                <form onSubmit={addTask}>
                  <Row className='formRow'>
                    <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                        <p className='labelText'>USER:</p>
                        <input
                          type='text'
                          name='username'
                          value={newTask.username}
                          onChange={handleTaskInput}
                          placeholder='username'
                          autoComplete='on'
                          className='taskInput'
                        />
                      </label>
                    </Col>
                    <Col xs={6} md={4}>
                      <label className='formLabel'>
                        <p className='labelText'>TITLE:</p>
                        <input
                          type='text'
                          name='title'
                          value={newTask.title}
                          onChange={handleTaskInput}
                          placeholder='task'
                          className='taskInput'
                          autoComplete='on'
                        />
                      </label>
                    </Col>
                    <Col xs={6} md={4}>
                      <Button variant='primary' type='submit' id='addTaskBtn'>
                        ADD TASK
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
              {error ? (
                <div>{error}</div>
              ) : (
                <div>
                  <ul>
                    {taskData.map((task) => (
                      <li key={task.taskId} className='tasks'>
                        <Row>
                          <Col>
                            <label>
                              <p>USER</p>
                            </label>
                            <p>{task.username}</p>
                          </Col>
                          <Col>
                            <label>
                              <p>TASK:</p>
                            </label>
                            <p>{task.title}</p>
                          </Col>
                          <Col></Col>
                          <Col></Col>
                        </Row>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <Row id='logoutRow'>
                  <Col id='logoutCol'>
                    <Button variant='primary' id='logoutBtn' onClick={logout}>
                      LOGOUT
                    </Button>
                  </Col>
                </Row>
              </div>
            </section>
          )}
        </Container>
      </div>
    </>
  );
}
