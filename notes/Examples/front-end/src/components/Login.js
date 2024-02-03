import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import FormHeadings from './FormHeadings';//Import FormHeadings function component

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
        submitLogin,
        userData,
        handleLogoutClick,
        setUserData,
        appLogin,
        login,//State to represent the login status
       
    }
) {

    //==============EVENT LISTENERS=========================
    // Function to handle input changes in the loginForm
    const handleLoginChange = (event) => {
        const {name, value} = event.target
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    //==========JSX RENDERING=====================

    return (
        // LoginPage
        <div id='login'>
            {/* Form Heading */}
           <FormHeadings headingText="LOGIN"/>
            {/* Login Form */}
            <Form onSubmit={submitLogin} id="loginForm">
                <Row className="loginRow">
                    <Col xs={6} md={4} className='loginCol'>
                        <Form.Group controlId="formUsername"className='formGroup'>
                            {/* Username Input */}
                            <Form.Label><p className='labelText'>USERNAME:</p></Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={userData.password}
                                onChange={handleLoginChange}
                                placeholder="Enter your username"
                                autoComplete="on"
                            />
                        </Form.Group>
                    </Col>
                    <Col className='loginCol'>
                        <Form.Group controlId="formPassword" className='formGroup'>
                            {/* Password Input */}
                            <Form.Label>  
                                <p className='labelText'>PASSWORD:</p>
                            </Form.Label>
                            <Form.Control
                                type="password"//Input type
                                name="password"
                                value={userData.password}
                                onChange={handleLoginChange}
                                placeholder="Enter your password"
                                autoComplete="on"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6} md={4} className='loginCol'>
                        <Button id='loginBtn' type="button" onClick={login ? handleLogoutClick : appLogin}>
                            {login ? 'Logout' : 'Login'}
                        </Button>
                    </Col>
                </Row>
            </Form>            
        </div>
    );
}
