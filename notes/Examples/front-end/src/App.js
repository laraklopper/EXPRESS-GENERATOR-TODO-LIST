import React, { useEffect, useState } from 'react';
import './App.css'
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from './components/Header';
import Registration from './components/Registration';
import Login from './components/Login'
import TaskForm from './components/TaskForm';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {
  //=========STATE VARIABLES======================
  //Task variables
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({
    username: '',
    title: '',
  });
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

    //===============REQUESTS=====================
  //------------GET REQUEST-----------
  //Function to fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/fetchTasks', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fetchedTasks = await response.json();
        setTaskData(fetchedTasks);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      setError(`Error fetching data : ${error.message}`);
      console.error(`Error fetching data : ${error.message}`);
    }
  };
  
 //------------POST REQUESTS----------------------
  //Function to submit login
  const submitLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userData.username, password: userData.password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          console.log('Successfully logged in');
          setLogin(true);
          setLoginStatus(true);
          localStorage.setItem('loginStatus', JSON.stringify(true));
          localStorage.setItem('userData', data.token);
          localStorage.setItem('token', data.token);
          setTaskData([]);
          fetchTasks();
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Failed to Login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed ${error.message}`);
    }
  };

  //Function to add a new User
  const addUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newUsername: newUserData.newUsername,
          newPassword: newUserData.newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          console.log('New User successfully added');
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
      setError(`Error adding new user ${error.message}`);
    }
  };

  const addTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newTask.username, title: newTask.title }),
      });

      if (response.ok) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        localStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');
      } else {
        throw new Error('Failed to add new Task');
      }
    } catch (error) {
      setError(`Error adding task ${error.message}`);
      console.error('Error adding task:', error.message);
      localStorage.removeItem('token');
    }
  };

  //=========EVENT LISTENERS=====================
  
  const appLogin = () => {
    setLoginStatus(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
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

    //===========JSX RENDERING==================

  return (
    <>
      <div id='appBody'>
        <Container>
        <Header/>
          {loginStatus ? (
            <section id='section1'>
              {isRegistration ? (
                <Registration
                addUser={addUser}
                newUserData={newUserData}
                setNewUserData={setNewUserData}
                />
              ) : (
             <Login
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
              <TaskForm addTask={addTask} newTask={newTask} setNewTask={setNewTask}/>
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
              <LogoutBtn logout={logout}/>
            </section>
          )}
        </Container>
      </div>
    </>
  );
}
