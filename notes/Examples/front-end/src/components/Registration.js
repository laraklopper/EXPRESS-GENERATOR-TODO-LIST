import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function Registration({
    addUser,
    newUserData,
    setNewUserData,
}) {

    const handleRegistrationChange = (event) => {
        const { name, value } = event.target;
        setNewUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

  return (
      <div id='Registration'>
          <Row className='regisRow'>
              <Col className='regisCol'>
                  <h2 className='h2'>REGISTRATION</h2>
              </Col>
              <form onSubmit={addUser}>
                  <Row className='regisRow'>
                      <Col xs={6} md={4} className='regisRow'>
                          <label className='regisLabel'>
                              <p className='labelText'>USERNAME:</p>
                              <input
                                  type='text'
                                  name='newUserName'
                                  value={newUserData.newUsername}
                                  onChange={handleRegistrationChange}
                                  className='regisInput'
                                  placeholder='username'
                              />
                          </label>
                      </Col>
                      <Col xs={6} md={4} className='regisCol'>
                          <label className='regisLabel'>
                              <p className='labelText'>PASSWORD:</p>
                              <input
                                  type='text'
                                  name='newPassword'
                                  value={newUserData.newPassword}
                                  onChange={handleRegistrationChange}
                                  className='regisInput'
                                  placeholder='password'
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
          </Row>
      </div>
  )
}
