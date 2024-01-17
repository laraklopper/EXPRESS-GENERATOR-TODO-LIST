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

export default function App() {
  const [taskData, setTaskData] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState(' ');
  const [newPassword, setNewPassword] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

  useEffect(() => {
    const storedTasks = sessionStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status >= 200 && response.status < 300) {
          const data = await response.json();
          setTaskData(data);
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
        sessionStorage.setItem('loginStatus', JSON.stringify(true));
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', data.token);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const storedLoginStatus = sessionStorage.getItem('loginStatus');
    const storedUsername = sessionStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedTasks = sessionStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  const addTask = async (taskInput) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: taskInput }),
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedList = await response.json();
        setTaskData(updatedList);
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task added successfully');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error.message);
      setError('Error adding task', error.message);
      sessionStorage.removeItem('token');
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('New user successfully added');
        const users = JSON.parse(sessionStorage.getItem('users')) || [];
        users.push({ username: newUsername, password: newPassword });
        sessionStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to add new user');
      }
    } catch (error) {
      console.error('Error adding new user', error.message);
      setError("Error adding new user", error.message);
    }
  };

  const editTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem('token');
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
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error.message);
      setError('Error editing task. Please try again.');
      sessionStorage.removeItem('token');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem('token');
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
        sessionStorage.setItem('tasks', JSON.stringify(updatedList));
        console.log('Task successfully deleted');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Error deleting task. Please try again.');
      sessionStorage.removeItem('token');
    }
  };

  const appLogin = () => {
    setLoginStatus(false);
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem('loginStatus');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    handleLogout();
  };

  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
    sessionStorage.removeItem('token');
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  return (
    <Container id='appContainer'>
      <Header />
      {loginStatus ? (
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
                setUsername={setUsername}
                setPassword={setPassword}
                username={username}
                password={password}
              />
            )}
            <ToggleBtn 
              isRegistration={isRegistration} 
              setIsRegistration={setIsRegistration}
              setNewPassword={setNewPassword}
              newPassword={newPassword}
              newUsername={newUsername}
              setNewUsername={setNewUsername}
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
            />
          </div>
        </section>
      ) : (
        <section id='section2'>
          <TaskForm addTask={addTask} taskInput={taskInput} setTaskInput={setTaskInput} />
          {error ? (
            <div>{error}</div>
          ) : !isLoaded ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {taskData.map((task) => (
                <li key={task.taskId} id='tasks'>
                  <div>
                    {task.taskId}
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => editTask(task.taskId)}>
                      EDIT
                    </Button>
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                      DELETE
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p>{error}</p>}
          <Row>
            <Col>
              <Button variant="primary" onClick={logout}>
                Logout
              </Button>
            </Col>
          </Row>
        </section>
      )}
    </Container>
  );
}
