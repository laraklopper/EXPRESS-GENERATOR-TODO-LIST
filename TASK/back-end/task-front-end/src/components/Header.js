import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Header function component
export default function Header() {//Export default header function component

    //============JSX============
    return (
        // Heading
        <header id='header'>
            <Row>
                <Col id='heading'>
                    <h1 className='h1'>TO DO LIST</h1>
                </Col>
            </Row>
        </header>
    )
}