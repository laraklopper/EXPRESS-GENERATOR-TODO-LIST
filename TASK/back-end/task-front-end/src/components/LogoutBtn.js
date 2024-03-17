// Import React and necessary components from Bootstrap
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//LogoutBtn function component
export default function LogoutBtn(//Export default LogoutBtn component
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
        logout//logout event 
    }) {

    //=======JSX RENDERING=========
    
  return (
      <Row>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4} className='logoutCol'>
            {/* Logout Button */}
              <Button variant="primary" onClick={logout}>
                  LOGOUT
              </Button>
          </Col>
      </Row>
  )
}
