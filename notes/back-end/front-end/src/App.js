import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const [login, setLogin] = useState(false);

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setLoginStatus(false);
    setLogin(false);
    localStorage.clear(); // Clear all stored data on logout
  };

  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Successfully logged in');
        setLogin(true);
        setLoginStatus(true);
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
      } else {
        const errorMessage = await response.json();
        throw new Error(`Failed to login: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Login Failed', error.message);
    }
  };

  return (
    <div>
      <Container>
        <Header />
        <Row>
          <Col>
            <Routes>
              <Route
                exact
                path="/login"
                element={<Login username={username} setUsername={setUsername} password={password} login={login} setPassword={setPassword} submitLogin={submitLogin} />}
              />
              <Route path="/home" element={<Home handleLogout={handleLogout} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
