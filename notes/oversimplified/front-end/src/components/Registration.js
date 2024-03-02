import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import FormText from './FormText';

export default function Registration({
    addUser,
    setNewUsername,
    newUsername,
    newPassword,
    setNewPassword
}) {

    
  return (
      <div id='registration'>
          <Header heading='REGISTRATION'/>
          <section>
             <FormText details='ENTER REGISTRATION DETAILS'/>
              <form onSubmit={addUser}>
                  <Row className='regisRow'>
                      <Col xs={6} md={4}>
                          <label>
                              <p>USERNAME:</p>
                              <input
                                  type='text'
                                  value={newUsername}
                                  onChange={(e) => setNewUsername(e.target.value)}
                                  name='newUsername'
                                  placeholder='USERNAME'
                                  autoComplete='off'
                                  className='regisInput'
                              />
                          </label>
                      </Col>
                      <Col xs={6} md={4}>
                          <label>
                              <p className='labelText'>PASSWORD:</p>
                              <input
                                  type='text'
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  name='newPassword'
                                  placeholder='PASSWORD'
                                  autoComplete='off'
                                  className='regisInput'
                              />
                          </label>
                      </Col>
                      <Col xs={6} md={4}>
                          <Button variant="primary" type='submit'>REGISTER</Button>
                      </Col>
                  </Row>
              </form>
          </section>
      </div>
  )
}
