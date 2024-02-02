import React, { useEffect, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {
  //=======STATE VARIABLES=================
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

   //==========USE EFFECT HOOK===============
  //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);

  //=========REQUESTS==================
  //----------GET REQUEST-------------------
  
  // useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const fetchedData = await response.json();
          setTaskData(fetchedData.tasks);
          console.log(fetchedData.tasks);
        } 
        else {
          throw new Error('Failed to fetch tasks');
        }
      } 
      catch (error) {
        setError(`Error fetching data: ${error.message}`);
        console.error('Error fetching data:');
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
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
          if (data.token) {
          console.log('Successfully logged in');
          setLogin(true)
          setLoginStatus(true)
          localStorage.setItem('loginStatus', JSON.stringify(true));
          localStorage.setItem('token', data.token);
          setTaskData([]);

          fetchTasks()
        } 
        else {
          throw new Error('Invalid response from server')
        }  

    } else {
      throw new Error('Failed to login');
    }
  } 
  catch (error) {
    setError(`Login Failed: ${error.message}`);
    console.error('Login Failed', error.message);

  }
};

  //useEffect hook to for retrieving Login Status and username from localStorage
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
    }
  }, []);

  //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  //Function to add user
  const addUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/users/register', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ newUsername: newUserData.newUsername, newPassword: newUserData.newPassword }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        console.log('New user successfully added');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('token', data.token); 
      } else {
        throw new Error('Invalid server response');
      }
    } else {
      throw new Error('Failed to add new user');
    }
  } catch (error) {
    console.error('Error adding new user', error.message);
    setError("Error adding new user", error.message);
  }
};
  
//Function to add a newTask
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

    if (response.ok/*response.status >= 200 && response.status < 300*/) {
      const updatedList = await response.json();
      setTaskData(updatedList);
      localStorage.setItem('tasks', JSON.stringify(updatedList));
      console.log('Task added successfully');
    } else {
      throw new Error('Failed to add task');
    }
  } catch (error) {
    console.error('Error adding task:', error.message);
    setError('Error adding task', error.message);
  }
};

 //-----------------PUT REQUEST----------------
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
  
//---------------DELETE REQUEST----------------------
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
      setError('Error deleting task', error.message);
      localStorage.removeItem('token');
    }
  };

      //==============EVENT LISTENERS=========================

   // Function to set login status to false, indicating that the user is in the process of logging in
    const appLogin = () => {
        setLoginStatus(false);
    };
    
    // Function to handle logout button click  
  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus')
    localStorage.removeItem('username')
    localStorage.removeItem('token')

  }

  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    setNewUserData({newUsername: '', newPassword: ''})
    setUserData({username: '', password: ''})
  }

    //Function to trigger logout button
 const logout = () => {
    setLoginStatus(true);
    setLogin(false)
    localStorage.removeItem('token')
  }
  //================JSX RENDERING==================

  return (
    <>
    {/* App body */}
      <div id='appBody'>
    {/* Container */}
        <Container id='appContainer'>
         {/* Header */}  
          <Header />
          { loginStatus ? (
            <div>
              <section id='section1'>
                  {isRegistration ? (
                    <RegistrationForm
                      newUsername={newUsername}
                      setNewUsername={setNewUsername}
                      newPassword={newPassword}
                      setNewPassword={setNewPassword}
                      setError={setError}
                    />
                  ) : (
                    <LoginForm
                       submitLogin={submitLogin}
                      login={login}
                      handleLogoutClick={handleLogoutClick}
                      userData={userData}
                      setUserData={setUserData}
                      appLogin={appLogin}
                    />
                  )}
                  <ToggleBtn isRegistration={isRegistration} togglePage={togglePage}/>
              </section>
          ) : (
            <section id='section2'>
            {/* Form to add task */}
              <TaskForm setTaskData={setTaskData} setError={setError} />
              {error ? (
                <div>{error}</div>
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
                           {/* <Button variant="primary" onClick={() => editTask(task.taskId)}> EDIT</Button> */}
                          </Col>
                          <Col className='tasksCol'>
                             {/* <Button variant="primary" onClick={() => deleteTask(task.taskId)}> DELETE</Button> */}
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
