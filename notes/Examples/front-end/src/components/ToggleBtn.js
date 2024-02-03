import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//ToggleBtn function component
export default function ToggleBtn(//Export default ToggleBtn function component
    {
        //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        isRegistration, //State to indicate whether the user is using the registration form
        togglePage  //Function to toggle between login and registration page     
    })
     {

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
