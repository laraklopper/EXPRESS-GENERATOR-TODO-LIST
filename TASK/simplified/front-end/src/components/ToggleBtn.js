import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//ToggleBtn function component
export default function ToggleBtn({
    //=========PROPS PASSED FROM PARENT COMPONENT===========
    togglePage, 
    isRegistration
    }) {

    //============JSX RENDERING====================
    
  return (
      <Row id='togglePageRow'>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4} className='toggleCol'>
              <Button variant="primary" type='button' 
              onClick={togglePage} id='toggleBtn'>
                  {isRegistration ? 
                  'LOGIN PAGE' : 'REGISTRATION PAGE'}
              </Button>
          </Col>
      </Row>
  )
}

