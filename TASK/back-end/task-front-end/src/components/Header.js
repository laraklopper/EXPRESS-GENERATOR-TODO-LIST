import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';//Import Bootstrap Row
import Col from 'react-bootstrap/Col';//Import bootstrap Colomn

//Header function component
export default function Header({//Export default header function component
    heading
}) {

    //==========JSX RENDERING==========
  return (
      <header id='header'>
          <Row>
              <Col id='headingCol'>
                  <h1 className='h1'>{heading}</h1>
              </Col>
          </Row>
      </header>
  )
}

}
