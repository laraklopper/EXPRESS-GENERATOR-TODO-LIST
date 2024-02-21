import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Registration function component
export default function Registration(
  {//=========PROPS PASSED FROM PARENT COMPONENT===========
  addUser, 
  setNewUserData, 
  newUserData
}) {

    //=========JSX RENDERING===============

  return (
    <div id='registrationPage'>
      <Row className='regisRow'>
        <Col className='regisCol'>
          <h3 className='h3'>ENTER DETAILS:</h3>
        </Col>
      </Row>
      <form id='registrationForm' onSubmit={addUser}>
        <Row className='regisRow'>
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>USERNAME:</p>
              <input
                type='text'
                value={newUserData.username}
                onChange={(e) => 
                  setNewUserData({ ...newUserData, 
                    username: e.target.value })}
                className='regisInput'
                placeholder='USERNAME'
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>PASSWORD:</p>
              <input
                type='password'
                value={newUserData.password}
                onChange={(e) => 
                  setNewUserData({ ...newUserData, 
                    password: e.target.value })}
                className='regisInput'
                placeholder='PASSWORD'
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            <Button variant="primary" type='submit' id='registrationBtn'>
              REGISTER
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}
