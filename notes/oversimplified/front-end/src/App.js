import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Registration from './components/Registration';
import Login from './components/Login';
import ToggleBtn from './components/ToggleBtn';
import AddTask from './components/AddTask';
import LogoutBtn from './components/LogoutBtn';


//App function component
export default function App() {
  //========STATE VARIABLES============
  //Task variables
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    user: '',
    title: ''
  });
  //User variables
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });
  const [newUserData, setNewUserData] = useState({ 
    newUsername: '',
    newPassword: ''
  });
  //Event variables
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedOut, setLoggedOut] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);

  //==============USE EFFECT HOOK TO FETCH TASK DATA==============

  useEffect (() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3001/users/findTasks', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const fetchedTasks = await response.json();
          setTasks(fetchedTasks)
          console.log(fetchedTasks);
        } 
        else {
          throw new Error ()
          
        }
      } catch (error) {
       setError(`Error fetching Data: ${error.message}`)
        console.error(`Error fetching Data: ${error.message}`); 
      }
    }

    if (loggedIn) {
      fetchTasks()
    }
  },[loggedIn])
  //=============REQUESTS=================
  //------------POST REQUESTS--------------------
  //Function to submitLogin
  const submitLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {username: formData.get('username'), password: formData.get('password')}
    try {
      const response = await fetch ('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Username or password are incorrect');
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error('Internal server Error');
      }

      localStorage.setItem('username', userData.username);
      localStorage.setItem('token', data.token);
      setLoggedIn(true);
      setError('');
    } 
    catch (error) {
      setError(`Login Failed ${error.message}`);
      console.error(`Login Failed ${error.message}`);
      setLoggedIn(false);
    }
  }

  //Function to add a new user
  const addUser = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newUserData = { newUsername : formData.get('username'), newPassword: formData.get('password')}

    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData)
      })

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const newUser = { username: newUserData.newUsername, password: newUserData.newPassword, userId: users.length + 1 };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
        } else {
          throw new Error('Invalid Server Response');
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`)
      console.log(`Error adding new user: ${error.message}`);
    }
  }

  //Function to add new Task
  const addTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTaskData = {user: formData.get('user'), title: formData.get('title')}

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token available')
      }
      const response = await fetch('http://localhost:3001/users/addTask',{
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: (newTaskData)
      })
      if (response.ok) {
        const newTaskObject = await response.json();
        setTasks(tasks => [...tasks, newTaskObject]);
        console.log('Task Successfully added');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      setError(`Error adding task: ${error.message}`)
      console.error(`Error adding tasks: ${error.message}`);
    }
  }

  //=======EVENT LISTENERS===============

  /*Function to set the loggedOut status to false
stating that the user is logged in*/
  const appLogin = () => {
    setLoggedOut(false)
  }
  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    if (isRegistration) {
      setNewUserData({ newUsername: '', newPassword: '' })
    } else {
      setUserData({username: '', password: ''})
    }
  }

  //Function to trigger logout Button
  const logout = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
    setLoggedOut(true)
    setUserData({username: '', password: ''})
  }

  //=======JSX RENDERING============
  return (
    <>
    <div id='appBody'>
      { loggedOut ? (
        <Container className='appContainer'>
          {isRegistration ? (  
            <div id='registrationPage'>
              <Registration
              addUser={addUser}
              setNewUserData={setNewUserData}
              newUserData={newUserData}
              />
            </div>
          ):(
            <div id='loginPage'>
              <Login 
              submitLogin={submitLogin}
              userData={userData}
              setUserData={setUserData}
              appLogin={appLogin}
              loggedIn={loggedIn}/>
            </div>
                      )}
          <section className='section2'>
              <ToggleBtn togglePage={togglePage} isRegistration={isRegistration}/>
          </section>
        </Container>
      ):(
        <Container className='appContainer'>
          <Header heading='TO DO LIST'/>
          <section className='section1'>
                <AddTask addTask={addTask} setNewTask={setNewTask} newTask={newTask}/>
          </section>
          <section className='section2'>
            {/* Error message */}
            { error ? (
              <div>{error && <p>{error}</p>}</div>
            ):(
              <ul className='taskItems'>
                {tasks.map((task)=>(
                  <li className='taskItem'>
                    <Row className='taskRow'>
                      <Col className='taskCol'>
                      <label className='taskLabel'>
                        <p className='labelText'>USER:</p>
                        <p className='outputText'>{task.user}</p>
                      </label>
                      </Col>
                      <Col className='taskCol'>
                         <label className='taskLabel'>
                          <p className='labelText'>USER:</p>
                          <p className='outputText'>{task.title}</p>
                        </label>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className='section3'>
                <LogoutBtn logout={logout}/>
          </section>
        </Container>
      )}
    </div> 
    </>
  )
}
