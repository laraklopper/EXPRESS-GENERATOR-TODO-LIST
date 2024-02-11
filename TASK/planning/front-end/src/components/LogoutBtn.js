import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//LogoutBtn function button
export default function LogoutBtn({
    //=======PROPS PASSED FROM THE PARENT COMPONENT==========
    logout
}) {

    //===========JSX RENDERING=============
  return (
      <Row>
          <Col>
              <Button variant='primary' onClick={logout}>
                  Logout
              </Button>
          </Col>
      </Row>    
  )
}
