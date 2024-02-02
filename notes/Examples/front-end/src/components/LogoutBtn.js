import React from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function LogoutBtn({logout}) {
  return (
      <Row id='logoutRow'>
          <Col id='logoutCol'>
              <Button variant="primary" id='logoutBtn' onClick={logout}>
                  LOGOUT
              </Button>
          </Col>
      </Row>
  )
}
