import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Header function component
export default function Header({heading}) {
    
    //=======JSX RENDERING=============
  return (
      <header id='header'>
          <Row id='headerRow'>
              <Col id='headerCol'>
                <h1 className='h1'>{heading}</h1>
                </Col>
          </Row>
      </header>
  )
}
