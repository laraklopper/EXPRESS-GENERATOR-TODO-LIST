import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function ToggleBtn({isRegistration, togglePage}) {

  return ( 
      <Row id='togglePageRow'>
        <Col xs={12} md={8} className='togglePageCol'></Col>
        <Col xs={6} md={4} className='togglePageCol'>
          <Button variant="primary" type='button' onClick={togglePage} id='togglePageBtn'>
            {isRegistration ? 'LOGIN PAGE' : 'REGISTRATION PAGE'}
          </Button>
        </Col>
      </Row>
  )
}
