import React from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Registration() {
  return (
    <div>
        <Row>
            <Col>
            <h2 className='h1'>REGISTER</h2>
            
            </Col>
        </Row>
          <form id='registrationForm'>
              <Row className='regisRow'>
                  <Col xs={6} md={4} className='regisFormCol'>
                      <label>
                          <p className='labelText'>USERNAME:</p>
                          <input
                             className='registrationInput'
                             type='email'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='regisFormCol'>
                      <label>
                          <p className='labelText'>PASSWORD:</p>
                          <input
                              type='password'
                              className='registrationInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <Button type='submit' variant="primary" id='loginBtn'>REGISTER</Button>
                  </Col>
              </Row>
          </form>
    </div>
  )
}
