import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Header function component
export default function Header() {

//================JSX RENDERING===========================
    
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
