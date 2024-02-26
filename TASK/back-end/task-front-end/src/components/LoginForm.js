import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
        login,
        submitLogin,       
        appLogin,
        userData,
        setUserData

    }
) {

    //==========JSX RENDERING=====================

    return (
        // LoginPage
        <div id='login'>
            <Row className='formHeading'>
                <Col md={12} className='formHeadingText'>
                    <h2 className='h2'>LOGIN</h2>
                </Col>
            </Row>
            {/* Login Form */}
            <Form onSubmit={submitLogin} id="loginForm">
                <Row className="loginRow">
                    <Col xs={6} md={4} className='loginCol'>
                        <Form.Group controlId="formUsername" className='formGroup'>
                            {/* Username Input */}
                            <Form.Label htmlfor='username>
                                <p className='labelText'>USERNAME:</p>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={(e) => setUserData( {...userData, username: e.target.value })}
                                placeholder="Enter your username"
                                id='username'
                              autoComplete='off'
                            />
                        </Form.Group>
                    </Col>
                    <Col className='loginCol'>
                        <Form.Group controlId="formPassword" className='formGroup'>
                            {/* Password Input */}
                            <Form.Label>  <p className='labelText'>PASSWORD:</p></Form.Label>
                            <Form.Control
                                type="password"//Input type
                                name="password"
                                value={userData.password}
                                id='password'
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                placeholder="Enter your password"
                                    autoComplete='current-password'
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6} md={4} className='loginCol'>
                       <Button variant="primary" type="submit" 
                      id='loginBtn' onClick={appLogin}>
                          {loggedIn ? 'LOGOUT' : 'LOGIN'}
                      </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
