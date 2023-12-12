import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

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
        <div>
            <Row>
                <Col>
                    <h2 className='h2'>LOGIN</h2>
                </Col>
            </Row>
            <Form onSubmit={submtLogin}>
                <Row>
                    <Col>
                        <label>
                            <p className='labelText'>USERNAME:</p>
                            <Form.Control
                                type='email'
                                name='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='input'
                                placeholder='username'
                            />
                        </label>
                    </Col>
                    <Col>
                        <label>
                            <p className='labelText'>PASSWORD:</p>
                            <Form.Control
                                type='password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='input'
                                placeholder='password'
                            />
                        </label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            type='button'
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
