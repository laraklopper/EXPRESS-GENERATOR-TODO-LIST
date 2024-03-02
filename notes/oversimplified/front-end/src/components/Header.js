import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Header({heading}) {
  return (
    <header>
        <Row>
            <Col>
            <h1 className='h1'>{heading}</h1>
            </Col>
        </Row>
    </header>
  )
}
