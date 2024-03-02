import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function FormText({details}) {
  return (
    <Row className='row'>
        <Col id='formTextCol'>
          <h3 className='h3'>{details}</h3>
      </Col>
    </Row>
  )
}
