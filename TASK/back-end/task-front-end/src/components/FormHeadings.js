import React from 'react'// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn

//Form Headings function component
export default function FormHeadings({headingText}) {//Export FormHeadings function component

  return (
      <Row className='formHeading'>
          <Col md={12}>
            {/* Form Heading Text */}
              <h2 className='h2'>{headingText}</h2>
          </Col>
      </Row>
  )
}
