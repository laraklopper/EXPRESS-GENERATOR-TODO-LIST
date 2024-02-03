import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//LogoutBtn function component
export default function LogoutBtn(//Export default LogoutBtn function component
    {
       logout
    }
) {
  

    //========JSX RENDERING================
  return (
      <div id='logout'>  
        <Row className='row'>
          <Col className='col'>
              {/* Button to Logout */}
              <Button variant="primary" onClick={logout} id='logoutBtn'>
                  Logout
              </Button>
          </Col>
      </Row></div>
  )
}
