import React from 'react';
//Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//ToggleBtn function component
export default function ToggleBtn(//Export default ToggleBtn function component
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========       
        isRegistration, 
        togglePage     
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
