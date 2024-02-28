import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//ToggleBtn function component
export default function ToggleBtn({
    togglePage,
    isRegistration
}) {


    //====JSX RENDERING=========
    
  return (
      <Row>
          <Col xs={12} md={8}>
          </Col>
          <Col xs={6} md={4}>
              <Button variant="primary" type='button' onClick={togglePage}>
                  {isRegistration ? 'LOGIN' : 'REGISTRATION'}
              </Button>
          </Col>
      </Row>
  )
}
