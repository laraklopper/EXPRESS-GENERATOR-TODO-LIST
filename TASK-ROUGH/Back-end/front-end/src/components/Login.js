import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//Login Function component
export default function Login(//Export Login Function component
    {
        username, 
        password, 
        setUsername, 
        setPassword, 
        submitLogin
    }
) 
{
    
//==============JSX RENDERING==============
  return (
    // Login Page
    <div id='loginPage'>
        {/* Form Heading */}
        <Row className='loginRow'>
            <Col id='loginHeading'>
                <h2 className='h2'>LOGIN</h2>
            </Col>
        </Row>
        {/* Login Form */}
       <form id='loginForm' onSubmit={submitLogin}>
              <Row className='loginRow'>
                  <Col xs={6} md={4} className='loginCol'>
                    <label>
                        <p className='labelText'>USERNAME:</p>
                        <input
                        type='email'
                        className='loginInput'
                        placeholder='username'
                        name='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <label>
                          <p className='labelText'>PASSWORD:</p>
                          <input 
                          type='password'
                          name='password'
                          className='loginInput'
                          placeholder='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          />
                      </label> 
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <Button type='submit' variant="primary" id='loginBtn'>LOGIN</Button>
                 </Col>
              </Row>
       </form>
        
    </div>
  )
}
