import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//ToggleBtn function component
export default function ToggleBtn(//Export default ToggleBtn function component
    {
        //props
        isRegistration, //State to indicate whether the user is using the registration form
        setIsRegistration, 
        setNewUsername, //State to store newUsername
        setUsername, 
        setNewPassword, //State to store newPassword
        setPassword
    })
     {

    // Function to toggle between registration and login pages
    const togglePage = () => {
        setIsRegistration(!isRegistration); // Toggle the isRegistration state
        setNewUsername(''); // Reset new username input
        setNewPassword(''); // Reset new password input
        setUsername(''); // Reset username input
        setPassword(''); // Reset password input
    };

    //===============JSX RENDERING====================
    
  return (
      <Row id='pageToggleRow'>
          <Col id='toggleCol'>
              {/* Button to toggle between the registration and Login Page */}
              <Button variant='primary' onClick={togglePage} id='toggleBtn'>
                  {isRegistration ? 'Login Page' : 'Registration Page'}
              </Button>
          </Col>
      </Row>
  )
}
