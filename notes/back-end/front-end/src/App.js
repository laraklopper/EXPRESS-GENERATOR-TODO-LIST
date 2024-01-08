import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import { Link, Route, Routes } from 'react-router-dom';
import Home from './home';
import Login from './login';
import './App.css';

export default function App(){

  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"))

    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }

    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3080/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
              }
        })
        .then(res => response.json())
        .then(res => {
            setLoggedIn('success' === res.message)
            setEmail(user.email || "")
        })
  }, [])
  
  return (
    <div className="App">
    <nav>
    <ul>
     <li className='navLink'><Link to="/Home">HOME</Link>  </li>
     <li className='navLink'><Link to="/Login">HOME</Link>  </li>
    </ul>
    </nav>

        <Routes>
          <Route exact path="/Home" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
        </Routes>
    </div>
  );
}
