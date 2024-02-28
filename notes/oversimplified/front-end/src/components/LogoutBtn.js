import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function LogoutBtn({
    logout
}) {
    //========JSX RENDERING========
  return (
      <Row>
          <Col xs={12} md={8}>
          </Col>
          <Col xs={6} md={4}>
              <Button variant="primary" onClick={logout}>LOGOUT</Button>
          </Col>
      </Row>
  )
}
