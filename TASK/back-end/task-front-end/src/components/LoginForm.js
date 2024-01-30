import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import FormHeadings from './FormHeadings';//Import FormHeadings function component

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
    {
        username,
        setUsername,
        password,
        setPassword,
        login,
        setLogin,
        setLoginStatus,
        setError,
        //setUserData,
        // userData

    }
) {

    //=========REQUESTS==================
    //======POST REQUEST=================
    //Function to submit login
    const submitLogin = async () => {//Define async function to submit login
        try {
            //Send a POST request to the server
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',//Request method
                mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
                headers: {//Set request headers
                    'Content-Type': 'application/json',//Specify the content-type for the request body 
                },
                body: JSON.stringify({ username, password }),// Convert user credentials to JSON format for the request body
            });

            // Conditional rendering to check if the server response is in the successful range (200-299)
            if (response.status >= 200 && response.status < 300) {
                const data = await response.json();// Parse the response JSON data

                console.log('Successfully logged in');// Display a success message in the console

                setLogin(true);// Set the 'login' state to true, indicating that the user is logged in
                setLoginStatus(true);// Set the 'loginStatus' state to true, indicating the overall login status
                localStorage.setItem('loginStatus', JSON.stringify(true));// Store the login status in localStorage as a string
                localStorage.setItem('username', username);// Store the username in localStorage
                localStorage.setItem('token', data.token);// Store the authentication token received from the server in localStorage
            }
            else {
                throw new Error('Failed to login');//Throw an error message if the POST request is unsuccessful
            }
        }
        catch (error) {
            // Handle any errors that occur during the request
            // console.error('Login Failed', error.message);//Log an error message in the console for debugging purposes
            setError(`Login Failed: ${error.message}`);//Set the error state with an error message
        }
    };


    //==============EVENT LISTENERS=========================

    // const handleLoginChange = (event) => {
    //     const { name, value } = event.target;
    //     setUserData((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }))
    // }
    // Function to set login status to false, indicating that the user is in the process of logging in
    const appLogin = () => {
        setLoginStatus(false);//Set the loginStatus to false
    };
    
    // Function to handle logout button click
    const handleLogoutClick = () => {
        // Remove stored login information and trigger logout process
        localStorage.removeItem('loginStatus');//Remove the loginStatus from localStorage 
        localStorage.removeItem('username');//Remove the username from localStorage
        localStorage.removeItem('token'); //Remove the stored token from localStorage

    };
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="on"
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
                            onClick={login ? handleLogoutClick : appLogin}>
                            {'Login'}
                        </Button>
                    </Col>
                </Row>
            </Form>            
        </div>
    );
}