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
  const [taskData, setTaskData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

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
          setIsLoaded(true);
          console.log(fetchedData.tasks);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        setIsLoaded(true);
        console.error('Error fetching data:');
      }
    }

  //   fetchTasks();
  // }, []);

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

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();

      console.log('Successfully logged in');

      setLogin(true);
      setLoginStatus(true);
      localStorage.setItem('loginStatus', JSON.stringify(true));
      localStorage.setItem('username', username);
      localStorage.setItem('token', data.token);
    } else {
      throw new Error('Failed to login');
    }
  } catch (error) {
    setError(`Login Failed: ${error.message}`);
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
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData, setTaskData]);

  
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
      body: JSON.stringify({ newUsername, newPassword }),
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      if (data.token) {
        console.log('New user successfully added');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        localStorage.setItem('users', JSON.stringify(users));
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
    } else {
      throw new Error('Failed to add task');
    }
  } catch (error) {
    console.error('Error adding task:', error.message);
    setError('Error adding task', error.message);
  }
};

  
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

      //==============EVENT LISTENERS=========================

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

    const togglePage = () => {
        setIsRegistration(!isRegistration); // Toggle the isRegistration state
        setNewUsername(''); // Reset new username input
        setNewPassword(''); // Reset new password input
        setUsername(''); // Reset username input
        setPassword(''); // Reset password input
    };

    //Function to trigger logout button
    const logout = () => {
        // Reset login status 
        setLoginStatus(true);
        setLogin(false);

        localStorage.removeItem('token');//Remove the stored token from localStorage
    };

  //================JSX RENDERING==================

  return (
    <>
      <div id='appBody'>
        <Container id='appContainer'>
          <Header />
          { loginStatus ? (
            <div>
              <section id='section1'>
                <div>
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
                      login={login}
                      setLoginStatus={setLoginStatus}
                      loginStatus={loginStatus}
                      setLogin={setLogin}
                      setError={setError}
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
