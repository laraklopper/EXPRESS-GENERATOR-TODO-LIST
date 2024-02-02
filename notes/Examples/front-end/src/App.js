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
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  // ===============REQUESTS=====================
  // ------------GET REQUEST-----------
//Function to fetch tsk
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
        console.log(fetchedTasks);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      setError(`Error fetching data : ${error.message}`);
      console.error(`Error fetching data : ${error.message}`);
    }
  };

  // ------------POST REQUESTS----------------------
  // Function to submit login

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

          fetchTasks()
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

  // Function to add User
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
        body: JSON.stringify({ newUsername: newUserData.newUsername, newPassword: newUserData.newPassword }),
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

  // Function to addNew task
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
