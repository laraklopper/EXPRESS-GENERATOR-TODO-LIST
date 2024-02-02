import React from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';


export default function ToggleBtn({isRegistration, togglePage}) {
  return (
      <Row id='pageToggleRow'>
          <Col id='pageToggleBtn'>
              <Button variant="primary" type="submit" id='toggleBtn' onClick={togglePage}>
                  {isRegistration ? 'Login Page' : 'Registration Page'}
              </Button>
          </Col>
      </Row>
  )
}
