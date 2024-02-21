// Import React and necessary components from Bootstrap
import React, { useEffect, useState } from 'react'
import './App.css';//Import CSS File
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Login from './components/Login';
import Registration from './components/Registration';
import AddTask from './components/AddTask';
import Header from './components/Header';
import ToggleBtn from './components/ToggleBtn';
import LogoutBtn from './components/LogoutBtn';

//App function component
export default function App() {//Export default App function component
  //========STATE VARIABLES============
  //Task variables
  const [tasks, setTasks] = useState([]);//State used to store tasks
  const [newTask, setNewTask] = useState({ 
    user: '', 
    title: '' 
  });
  //User variables
  const [userData, setUserData] = useState({ // State variable to store user login credentials
    username: '', 
    password: '' });
  const [newUserData, setNewUserData] = useState({ //State used to store new UserDetails
    newUsername: '', 
    newPassword: '' 
  });
  //Event variables
  const [error, setError] = useState(null);// State variable to store any errors that occur
  const [loggedIn, setLoggedIn] = useState(false);//State to indicate if the user is logged in
  const [loggedOut, setLoggedOut] = useState(true)//State to idicat if the user is logged out
  const [isRegistration, setIsRegistration] = useState(false);//State to indicate whether the user is in registration mode

  //==============USE EFFECT HOOK TO FETCH TASK DATA==============

  useEffect (() => {
    //Function to fetch tasks
    const fetchTasks = async () => {//Define an async function to fetch tasks
      try {
        const token = localStorage.getItem('token')// Retrieve token from localStorage
        //Send a GET request to the /findTasks endpoint
        const response = await fetch ('http://localhost:3001/users/findTasks',{
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const fetchedData = await response.json();
          setTasks(fetchedData)
          console.log(fetchedData);
        } 
        else {
          throw new Error('Failed to fetch tasks')
        }
      } 
      catch (error) {
        setError(`Error fetching data: ${error.message}`);
      }
    }
    // Invoke the fetchTasks function when the component mounts
    fetchTasks()
  },[]);


  //=============REQUESTS=================
  //------------POST REQUESTS--------------------

  //Function to submitLogin
  const submitLogin = async () => {//Define an async function to submitLogin 
    
    try {
      const response =await fetch ('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: userData.username, 
            password: userData.password
          })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          localStorage.setItem('username', userData.username);
          setLoggedIn(true);
          setLoggedOut(false)
          localStorage.setItem('token', data.token)
        } else {
          throw new Error ('Invalid server response')
        }  
      } 
      else {
        throw new Error('Failed to login');
      }

    } 
    catch (error) {
      setError(`Login Failed ${error.message}`)
      console.log(`Login Failed ${error.message}`);
    }
  }

  //Function to add a new user
  const addUser = async (e) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      const response = await fetch ('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newUsername: newUserData.newUsername, 
          newPassword : newUserData.newPassword
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const newUser = { username: newUserData.newUsername, password: newUserData.newPassword, userId: users.length + 1 };
          users.push(newUser)
          localStorage.setItem('users', JSON.stringify(users))
        }
        else{
          throw new Error ('Invalid Server Response')
        }       
      } 
      else 
      {
        throw new Error('Failed to add new user');
      }
    } 
    catch (error) {
      setError(`Error adding new user: ${error.message}`);
    }
  }




  //Function to add new task
  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      const response = await fetch('http://localhost:3001/users/addTask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({user:newTask.user, title: newTask.title}),
      });
      if (response.ok) {
        const newTaskObject = await response.json();
        setTasks(tasks => [...tasks, newTaskObject]); 
        console.log('Task added successfully');        
      } 
      else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      setError(`Error adding task: ${error.message}`);
    }
  };



  //=======EVENT LISTENERS===============

  /*Function to set the loggedOut status to false 
  stating that the user is logged in*/
  const appLogin = () => {
    setLoggedOut(false)
  }
  //Function to toggle between login and registration page
  const togglePage = () => {
    setIsRegistration(!isRegistration)
    setNewUserData({ username: '', password: '' })
    setUserData({ username: '', password: '' })
  }

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false)
    setLoggedOut(true)
    setUserData({username:'', password:''});
  }

  //=========JSX RENDERING================

  return (
    <>
    {/* appBody */}
    <div id='appBody'>
      {loggedOut ? (
         <Container className='appContainer'>
              {isRegistration ? (
              // RegistrationPage
                <div id='register'>
                 {/* Header */}
                  <Header heading='REGISTRATION' />
                  {/* section1 */}
                  <section className='section1'>
                    <Registration
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
                  </section>
                </div>
              ) : (
                // LoginPage
                <div id='login'>
                  {/* Header */}
                  <Header heading="LOGIN" />
                  <section className='section1'>
                    <Login 
                    submitLogin={submitLogin} 
                    userData={userData} 
                    setUserData={setUserData} 
                    appLogin={appLogin} 
                    loggedIn={loggedIn}/>
                  </section>
                </div>
              )}
              {/* Section 2 */}
              <section className='section2'>
                {/* Button to toggle between 
                login and registration page */}
                <ToggleBtn 
                togglePage={togglePage} 
                isRegistration={isRegistration} />
              </section>
            </Container>         
      ):(
            <Container className='appContainer'>
              {/* Header */}
              <Header heading="TO DO LIST" />
              <section className='section1'>
                <AddTask addTask={addTask} 
                newTask={newTask} 
                setNewTask={setNewTask} />
              </section>
              <section className='section2'>
                <Row>
                  <Col>
                    <h3 className='h3'>TASKS</h3>
                  </Col>
                </Row>
                {/* Error message */}
                {error ? (
                  <div>{error && <p>{error}</p>}</div>
                ) : (
                  // Task Output
                  <ul id='taskItem'>
                    {tasks.map((task) => (
                      <li key={task.id} className='taskItem'>
                        <Row className='taskRow'>
                          <Col className='taskCol'>
                            <label className='taskLabelxx'>
                              <p className='labelText'>USER:</p> 
                              <p className='outputText'>{task.user}</p>
                            </label>
                          </Col>
                          <Col className='taskCol'>
                            <label className='taskLabel'>
                              <p className='labelText'>TASK:</p>                            
                            <p className='outputText'>{task.title}</p>
                            </label>
                          </Col>                         
                          <Col className='taskCol'>
                            {/* Edit Button */}
                            <Button variant='primary' type='button' id='editBtn'>
                              EDIT
                            </Button>
                          </Col>
                          <Col className='taskCol'>
                            {/* Delete Button */}
                            <Button variant='danger' type='button' id='deleteBtn'>
                              DELETE
                            </Button>
                          </Col>
                        </Row>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {/* section3 */}
              <section className='section3'>
                <LogoutBtn logout={logout} />
              </section>
            </Container>    
      )}
    </div>
    </>
  )
}
