import React, { useEffect, useState } from 'react';
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
export default function App() {//Export default App function component
  //===========STATE VARIABLES=================
  //Task variables
  const [taskData, setTaskData] = useState([]); 
  const [newTask, setNewTask] = useState({
    username: '',
    title: '',
  })
  //User variables
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newPassword: '',
  });
  //Event variables  
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);
  const [token, setToken] = useState(null);
 
  //===============USE EFFECT HOOKS==============

  
useEffect(() => {
  const storedTasks = localStorage.getItem(''loginStatus');

  if (storedTasks){
    setTasks(JSON.parse(storedTasks))
  }
},[taskData])
  
    //Function to fetch tasks
    const fetchTasks = async () => {
      try {
        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        const fetchedTasks = await response.json();

        if (response.ok) {
          setTaskData(fetchedTasks);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        console.error('Error fetching data:', error);
      }
    };

 //===================REQUESTS====================
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

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);

        fetchTasks()
        if (data.token) {
          console.log('Successfully logged in');
          setLogin(true);
          setLoginStatus(true);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed: ${error.message}`);
    }
  };

  //Function to add a new User
  const addUser = async () => {//Define an async funciton to add a new User
    try {
      
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
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
          const users= JSON.parse('userData') || []
    
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
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',//Request method
        mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
         'Content-type': 'application/json',//Specify the content type
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
       JSON.stringify(updatedList);
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
          }
  };

  //------------PUT REQUEST-----------------
  //Function to edit a task
  const editTask = async (taskId) => {
    try {
      const taskToUpdate = taskData.find((task) => task.id === taskId);

      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
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
    JSON.stringify(updatedList);
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
  //Function to delete a task
  const deleteTask = async (taskId) => {//Define an async funciton to Delete a task
    try {
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
        headers: {
          'Content-type': 'application/json',//Specify the content type
          'Authorization': token ? `Bearer ${token}`,//Authorization header as the bearer token
        },
      });

      // Conditional rendering to check if the server response is in the successful range (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
      JSON.stringify(updatedList)
        console.log('Task successfully deleted');//Log a success message in the console if the task is successfully deleted
      } else {
        throw new Error('Failed to delete task');//Throw an error message if the DELETE request is unsuccessful
      }
    } 
    catch (error) {
      // Handle any errors that occur during the request
      console.error('Error deleting task:', error.message);//Log an error message in the console for debugging purposes
      setError('Error deleting task. Please try again.');//Set the error state
    }
  };

  //==========EVENT LISTENERS=================
  
  // Function to set login status to false, indicating that the user is in the process of logging in
  const appLogin = () => {
    setLoginStatus(false);
  };
  
  // Function to toggle between registration and login pages
  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUserData({ newUsername: '', newPassword: '' });
    setUserData({ username: '', password: '' });
  };
  
  //Function to trigger logout button
  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
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
