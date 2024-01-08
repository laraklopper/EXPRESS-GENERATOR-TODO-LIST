import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormHeadings from './FormHeadings';

// LoginForm function component
export default function LoginForm () {
  const [username, setUsername] = useState(''); // Add state for username
  const [password, setPassword] = useState(''); // Add state for password
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false); // Add state for login status

  // Async function to submit login
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
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError('Login Failed', error.message);
    }
  };

  // Function to handle login or logout click
  const handleLoginClick = () => {
    if (login) {
      // Handle logout logic here
      setLogin(false);
    } else {
      // Handle login logic here
      submitLogin();
    }
  };

  return (
    <div id='login'>
      {user && <Navigate to="/LoginPage" replace={true} />}
      <FormHeadings headingText="LOGIN"/>
      <Form onSubmit={submitLogin} id="loginForm">
        <Row className="loginRow">
          <Col xs={6} md={4} className='loginCol'>
            <Form.Group controlId="formUsername" className='formGroup'>
              <Form.Label><p className='labelText'>USERNAME:</p></Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="on"
              />
            </Form.Group>
          </Col>
          <Col className='loginCol'>
            <Form.Group controlId="formPassword" className='formGroup'>
              <Form.Label><p className='labelText'>PASSWORD:</p></Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="on"
              />
            </Form.Group>
          </Col>
          <Col xs={6} md={4} className='loginCol'>
            <Button
              type="button"
              onClick={handleLoginClick}
              variant={login ? 'danger' : 'primary'}
            >
              {login ? 'Logout' : 'Login'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

