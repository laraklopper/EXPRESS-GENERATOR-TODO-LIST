// Import React and necessary components from Bootstrap
import React, { /*useEffect,*/ useState } from 'react';
import './App.css';
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Login from './components/Login';
import Registration from './components/Registration';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';
import AddTask from './components/AddTask';
import Header from './components/Header';

// App function component
export default function App() {//Export default App function component
  //========STATE VARIABLES===========
  //Task variables
  const [tasks, setTasks] = useState([]);
  const [newTaskUser, setNewTaskUser] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  //User Variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // State variables for login/logout status
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedOut, setLoggedOut] = useState(true);
  //Event variables
  const [error, setError] = useState(null);
  const [isRegistration, setIsRegistration] = useState(false);


  // Use Effect hook to fetch task data
  // useEffect(() => {
    //Function to fetch Tasks
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (loggedIn && token) {
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
            setTasks(fetchedData);
            console.log(fetchedData);
          } else {
            throw new Error('Failed to fetch Tasks');
          }
        }
      } catch (error) {
        setError(`Error fetching task data: ${error.message}`);
        console.error(`Error fetching task data: ${error.message}`);
      }
    };

 //   fetchTasks();
 // }, [loggedIn]);

  //=============REQUESTS=================
  //------------POST REQUESTS--------------------
  
    const submitLogin = async (e) => {
    e.preventDefault();
    const userData = { username, password };
    console.log(userData);
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.jwtToken);
        console.log(data.jwtToken);
        setLoggedIn(true);
        setLoggedOut(false);
        fetchTasks()
      } else {
        throw new Error('Username or password are incorrect');
      }

    } catch (error) {
      console.error(`Error:, ${error}`);
    }
  };

  // Function to add new user
  const addUser = async (e) => {
    e.preventDefault();
    const newUserData = { newUsername, newPassword };
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const newUser = { username: newUserData.newUsername, password: newUserData.newPassword, userId: users.length + 1 };
          users.push(newUser);
          let allUsers = localStorage.setItem('users', JSON.stringify(users));
          console.log(allUsers);
        } else {
          throw new Error('Invalid Server Response');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
    }
  };

  //Function to addNewTask
  const addTask = async (e) => {
    e.preventDefault();
    const newTaskData = { user: newTaskUser, title: newTaskTitle };
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTaskData),
      });

      if (response.ok) {
        const newTaskObject = await response.json();
        setTasks(tasks => [...tasks, newTaskObject]);
        console.log('Task added successfully');
        localStorage.setItem(newTaskData)
      }
      else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      setError(`Error adding task: ${error.message}`);
      console.error(`Error adding task: ${error.message}`);
    }
  };


  //===========EVENT LISTENERS==================

  // Login status handler
  const appLogin = () => {
    const token = localStorage.getItem('token');
    if (loggedIn && token) {
      setLoggedOut(false);
    }
  };

  // Toggle between registration and login page
  const togglePage = () => {
    setIsRegistration(!isRegistration);
    setNewUsername('');
    setNewPassword('');
    setUsername('');
    setPassword('');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setLoggedOut(true);
    setUsername('');
    setPassword('');
  };

  //=========JSX RENDERING================

  return (
    <>
      {loggedOut ? (
        <Container className='appContainer'>
          {isRegistration ? (
            <Registration
            addUser={addUser}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            newPassword={newPassword}
            setNewPassword={setNewPassword}/>
          ) : (
            <Login
            submitLogin={submitLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            appLogin={appLogin}
            />
          )}
          <section>
           <ToggleBtn isRegistration={isRegistration} togglePage={togglePage}/>
          </section>
        </Container>
      ) : (
        <Container>
        <Header heading='TO DO LIST'/>
          <AddTask
          addTask={addTask}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskUser={newTaskUser}
          setNewTaskUser={setNewTaskUser}
          />
          <section>
            <Row>
              <Col><h3>TASKS</h3></Col>
            </Row>
            {error ? (
              <div>{error && <p>{error}</p>}</div>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>
                    <div>
                      <p><strong>USER:</strong> {task.user}</p>
                    </div>
                    <div>
                      <p><strong>TITLE:</strong> {task.title}</p>
                    </div>                  
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
              <LogoutBtn logout={logout}/>
          </section>
        </Container>
      )}
    </>
  );
}
