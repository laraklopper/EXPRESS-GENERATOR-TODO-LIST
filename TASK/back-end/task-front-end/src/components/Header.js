// Import React and necessary components from Bootstrap
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Header Function component
export default function Header(//Export default Header function component
  {//Props
    heading}
  ) {

    //=======JSX RENDERING=========

  return (
    <header id='header'>
        <Row>
            <Col>
             <h1 className='h1'>{heading}</h1>
            </Col>
        </Row>
    </header>
  )
}
