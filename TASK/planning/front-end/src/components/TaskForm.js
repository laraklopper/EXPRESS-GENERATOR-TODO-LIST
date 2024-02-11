import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Registration function component
export default function Registration(
  {
    addUser,
    newUserData,
    setNewUserData
  }
) 
{
  //=============JSX RENDERING===========
  return (
    <div>
      <Row className='regisRow'>
        <Col id='regisHeading'>
          <h2 className='h2'>REGISTRATION:</h2>
        </Col>
      </Row>
      <form onSubmit={addUser} id='registrationForm'>
        <Row className='regisRow'>
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>USERNAME:</p>
              <input
                type='text'
                value={newUserData.newUsername}
                onChange={(e) => setNewUserData(
                  {
                    ...newUserData,
                    newUsername: e.target.value
                  })}
                placeholder='USERNAME'
                className='regisInput'
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>PASSWORD:</p>
              <input
                type='password'
                value={newUserData.newPassword}
                onChange={(e) => setNewUserData({...newUserData, newPassword: e.target.value})}
                placeholder='PASSWORD'
                className='regisInput'
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisBtn'>
            <Button variant="primary" type="submit" id='registrationBtn'>
              REGISTER
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}
