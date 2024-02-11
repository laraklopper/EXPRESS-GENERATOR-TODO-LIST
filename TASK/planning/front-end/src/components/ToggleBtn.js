import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//ToggleBtn Function component
export default function ToggleBtn(
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
    togglePage, 
    isRegistration
    }) 
{

    //=============JSX RENDERING========
  return (
      <Row>
          <Col>
              <Button variant='primary' onClick={togglePage}>
                  {isRegistration ? 'LoginPage' : 'Registration Page'}
              </Button>
          </Col>
      </Row>
  )
}
