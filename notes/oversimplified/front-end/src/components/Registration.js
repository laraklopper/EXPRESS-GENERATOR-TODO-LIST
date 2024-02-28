import React from 'react'
import Header from './Header'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Registration({
    addUser,
    newUserData,
    setNewUserData
}) {


    //===========JSX RENDERING=============

  return (
    <div>
          <Header heading='REGISTER' />
          <section className='section1'>
              <form id='registrationForm' onSubmit={addUser}>
                  <Row>
                      <Col xs={6} md={4}>
                          <label className='regisLabel'>
                              <p className='labelText'>USERNAME:</p>
                              <input
                                  type='text'
                                  value={newUserData.newUsername}
                                  onChange={(e) => setNewUserData({ ...newUserData, newUsername: e.target.value })}
                                  name='username'
                                  autoComplete='off'
                                  placeholder='USERNAME'
                                  className='regisInput'
                              />
                          </label>
                      </Col>
                      <Col xs={6} md={4}>
                          <label>
                              <p className='labelText'>PASSWORD:</p>
                              <input
                                  type='password'
                                  value={newUserData.newPassword}
                                  onChange={(e) => setNewUserData({ ...newUserData, newPassword: e.target.value })}
                                  name='password'
                                  autoComplete='off'
                                  placeholder='PASSWORD'
                                  className='regisInput'
                              />
                          </label>
                      </Col>
                      <Col xs={6} md={4}>
                          <Button variant="primary" type='submit'>
                              REGISTER
                          </Button>
                      </Col>
                  </Row>
              </form>
          </section>
    </div>
  )
}
