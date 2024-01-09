import React from 'react';
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormHeadings from './FormHeadings';

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
    {
        submtLogin,
        appLogin,
        username,
        setUsername,
        password,
        setPassword,
        login,
        handleLogoutClick
    }
) {

    //==========JSX RENDERING=====================

    return (
        // LoginPage
        <div id='login'>
            {/* Form Heading */}
           <FormHeadings headingText="LOGIN"/>
            {/* Login Form */}
            <Form onSubmit={submtLogin} id="loginForm">
                <Row className="loginRow">
                    <Col xs={6} md={4} className='loginCol'>
                        <Form.Group controlId="formUsername"className='formGroup'>
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
                            <Form.Label>  <p className='labelText'>PASSWORD:</p></Form.Label>
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
                            onClick={login ? handleLogoutClick : appLogin}
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