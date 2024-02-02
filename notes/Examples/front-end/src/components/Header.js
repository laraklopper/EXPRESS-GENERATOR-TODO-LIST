import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Header() {
  return (
      <header id='header'>
          <Row>
              <Col>
                  <h1 className='h1'>TO DO LIST</h1>
              </Col>
          </Row>
      </header>
  )
}
