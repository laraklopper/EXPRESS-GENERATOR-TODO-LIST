import React, { useEffect, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {
  //=========STATE VARIABLES======================
  //--------Task variables------------
  const [taskData, setTaskData] = useState([]);
  // const [taskInput, setTaskInput] = useState()
  // const [newTask, setNewTask] = useState({
  //   username: '',
  //   title: '',
  // })
  //---------User variables-------------
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState(' ');
  const [newPassword, setNewPassword] = useState('');
  // const [userData, setUserData] = useState({
  //   username: '',
  //   password: '',
  // })
  // const [newUserData, setNewUserData] = useState({
  //   newUsername: '',
  //   newPassword: '',
  // })
  //--------Event variables---------------- 
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

    //===============USE EFFECT HOOKS==============

    //useEffect hook used to retrieve and update Task Data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTaskData(JSON.parse(storedTasks));
    }
  }, [taskData]);

   //===============REQUESTS=====================
  //------------GET REQUEST-----------

  //Function to fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch ('http://localhost:3001/users/fetchTasks', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (response.ok) {
        const fetchedTasks = await response.json()
        setTaskData(fetchedTasks)
        console.log(fetchedTasks);
        
      } else {
        throw new Error ('Failed to fetch tasks')
      }
    } catch (error) {
      setError(`Error fetching data : ${error.message}`)
      console.error(`Error fetching data : ${error.message}`);
    }
  }
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await fetch('http://localhost:3001/users/findTasks', {
  //         method: 'GET',
  //         mode: "cors",
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         }
  //       });

  //       if (response.ok) {
  //         const fetchedTasks = await response.json()
  //         setTaskData(fetchedTasks);
  //         setIsLoaded(true);
  //         console.log(fetchedTasks);
  //       } 
  //       else {
  //         throw new Error('Failed to fetch tasks');
  //       }
  //     } catch (error) {
  //       setError(`Error fetching data: ${error.message}`);
  //       console.error(`Error fetching data : ${error.message}`);
  //       setIsLoaded(true);
  //     }
  //   }
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('loginStatus');
    const storedUsername = localStorage.getItem('username');

    if (storedLoginStatus && storedUsername) {
      setLogin(JSON.parse(storedLoginStatus));
    }
  }, []);

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

      if (response.ok/*response.status >= 200 && response.status < 300*/) {
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

      if (response.ok/*response.status >= 200 && response.status < 300*/) {
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

  //===========JSX RENDERING==================
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
                        <Row>
                          <Col>
                            <label>
                              <p>USER:</p>
                            </label>
                            <p>{task.username}</p>
                          </Col>
                          <Col>
                            <label><p>TASK:</p></label>
                            <p>{task.title}</p>
                          </Col>
                                  {*<Col>
                            <Button variant="primary" onClick={() => editTask(task.taskId)}>
                              EDIT
                            </Button>
                          </Col>
                          <Col>
                            <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                              DELETE
                            </Button>
                          </Col>*}
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
