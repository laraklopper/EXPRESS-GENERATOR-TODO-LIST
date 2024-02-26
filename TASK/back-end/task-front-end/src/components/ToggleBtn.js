import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';//Import Bootstrap Row
import Col from 'react-bootstrap/Col';//Import bootstrap Colomn
import Button from 'react-bootstrap/Button';//Import bootstrap Button component

//ToggleBtn function component
export default function ToggleBtn(//Export default ToggleBtn function component
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========       
        isRegistration, 
        togglePage     
    })
     {

    //===============JSX RENDERING====================
    
  return (
     <Row id='togglePageRow'>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4} className='toggleCol'>
              {/* Button to toggle between the registration and Login Page */}
              <Button variant="primary" type='button' onClick={togglePage} id='toggleBtn'>
                  {isRegistration ? 'LOGIN PAGE' : 'REGISTRATION PAGE'}
              </Button>
          </Col>
      </Row>
  )
}
