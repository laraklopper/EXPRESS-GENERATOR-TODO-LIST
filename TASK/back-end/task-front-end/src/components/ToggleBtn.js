// Import React and necessary components from Bootstrap
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//ToggleBtn function component
export default function ToggleBtn(//Export default toggleBtn function component
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
        isRegistration, // Boolean state variable indicating whether the registration page is currently active.
        togglePage//togglePage event
    }) 
    {

    //========JSX RENDERING========

  return (
      <Row>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4} className='toggleCol'>
              {/* Button to toggle between login and registration page */}
              <Button variant="primary" onClick={togglePage}>
                  {isRegistration ? 'LOGIN PAGE' : 'REGISTRATION PAGE'}
              </Button>
          </Col>
      </Row>
  )
}
