// App.js
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
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/', {
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
          console.log(data);
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
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

  const addTask = async (taskInput) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: taskInput }),
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
      localStorage.removeItem('token');
    }
  };

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
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('New user successfully added');
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
        console.log('Task successfully deleted');

        const updatedList = await response.json();
        setTaskData(updatedList);

        localStorage.setItem('tasks', JSON.stringify(updatedList));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Error deleting task. Please try again.');
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setLogin(false);
    setUsername('');
    setPassword('');
    setTaskData([]);
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('tasks');
  };

  //==============JSX RENDERING==================
  
  return (
    <Container className="app-container">
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row>
        <Col>
          <ToggleBtn
            loginStatus={loginStatus}
            setLoginStatus={setLoginStatus}
            setLogin={setLogin}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </Col>
      </Row>
      <Row className="main-content">
        {login ? (
          <>
            <Col md={4} className="task-form">
              <TaskForm
                taskInput={taskInput}
                setTaskInput={setTaskInput}
                addTask={addTask}
              />
            </Col>
            <Col md={8} className="task-list">
              {/* Task List Component */}
              {isLoaded ? (
                taskData.length > 0 ? (
                  taskData.map((task) => (
                    <div key={task.id} className="task-item">
                      <span>{task.title}</span>
                      // <Button
                      //   variant="info"
                      //   onClick={() => editTask(task.id)}
                      // >
                      //   Edit
                      // </Button>
                      // <Button
                      //   variant="danger"
                      //   onClick={() => deleteTask(task.id)}
                      // >
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No tasks available</p>
                )
              ) : (
                <p>Loading tasks...</p>
              )}
            </Col>
            
          </>
        ) : (
          <Col  className="auth-form">
            {isRegistration ? (
              <RegistrationForm
                setNewUsername={setNewUsername}
                setNewPassword={setNewPassword}
                addUser={addUser}
                setIsRegistration={setIsRegistration}
              />
            ) : (
              <LoginForm
                setUsername={setUsername}
                setPassword={setPassword}
                submitLogin={submitLogin}
                setIsRegistration={setIsRegistration}
              />
            )}
          </Col>
        )}
      </Row>
      {error && (
        <Row>
          <Col>
            <p className="error-message">{error}</p>
          </Col>
        </Row>
      )}
    </Container>
  );
}
