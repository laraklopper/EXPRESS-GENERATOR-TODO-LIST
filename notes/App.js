import React, { useEffect, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import { useForm } from 'react-hook-form';

export default function App() {
  const [taskData, setTaskData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [login, setLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loginStatus, setLoginStatus] = useState(true);
  const [taskInput, setTaskInput] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isRegistration, setIsRegistration] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:3001/users/findtasks');

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTaskData(data);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
        setIsLoaded(true);
      }
    }

    fetchTasks();
  }, []);

  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      console.log('Successfully logged in');
      setLogin(true);
    } catch (error) {
      console.error('Login Failed', error);
      setError('Error logging in. Please try again.');
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to add newUser');
      }

      console.log('New user successfully added');
    } catch (error) {
      console.error('Error adding new user:', error);
      setError('Error adding new user. Please try again.');
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch('http://localhost:3001/addTask', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ value: taskInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const updatedList = await response.json();
      setTaskData(updatedList);
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Error adding task. Please try again.');
    }
  };

  const editTask = async (taskId) => {
    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === taskId);
      const response = await fetch(`http://localhost:3001/editTask/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          value: taskToUpdate.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit task');
      }

      console.log('Task successfully updated');
    } catch (error) {
      console.error('Error editing task:', error);
      setError('Error editing task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      const updatedList = await response.json();
      setTaskData(updatedList);
      console.log('Task successfully deleted');
      setUpdatedTasks([]);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error deleting task. Please try again.');
    }
  };

  const appLogin = () => {
    setLoginStatus(false);
  };

  const logout = () => {
    setLoginStatus(true);
    setLogin(false);
  };

  const togglePage = () => {
    setIsRegistration(!isRegistration);
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    appLogin();
  };

  const onSubmit = (data) => {
    addTask(data.task);
    reset();
  };

  return (
    <Container id="appContainer">
      <Header />
      <section id='section1'>
        {loginStatus ? (
          <>
            {isRegistration ? (
              <RegistrationForm
                addUser={addUser}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
              />
            ) : (
              <LoginForm
                submitLogin={submitLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                appLogin={appLogin}
                login={login}
                handleLogout={handleLogout}
              />
            )}
            <Button variant='primary' onClick={togglePage} id='registrationBtn'>
              {isRegistration ? 'Login Page' : 'Register'}
            </Button>
          </>
        ) : (
          <section id='section2'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col>
                  <label>
                    <input
                      type='text'
                      {...register('task', { required: true })}
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      className='input'
                    />
                  </label>
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                    ADD TASK
                  </Button>
                </Col>
              </Row>
            </form>
            {isLoaded ? (
              <ListGroup>
                {taskData.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.value}
                    <div>
                      <Button variant="primary" onClick={() => deleteTask(item.id)}>
                        DELETE
                      </Button>
                    </div>
                    <div>
                      <Button variant="primary" onClick={() => editTask(item.id)}>
                        EDIT
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Loading...</p>
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
      </section>
    </Container>
  );
}
