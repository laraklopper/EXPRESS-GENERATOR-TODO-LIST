import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormText from './FormText';
import Header from './Header'
//Login function component
export default function Login({
    submitLogin,
    username,
    setUsername,
    password,
    setPassword,
    appLogin,
    loggedIn
}) {

    //==========JSX RENDERING==============

  return (
    <div>
        <Header heading='LOGIN'/>
    <section className='section'>
          <FormText details='ENTER LOGIN DETAILS'/>
          <form onSubmit={submitLogin}>
              <Row className='loginRow'>
                  <Col xs={6} md={4} className='loginCol'>
                      <label><p>USERNAME:</p>
                          <input
                              type='text'
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              name='username'
                              autoComplete='off'
                          /></label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <label>
                          <p>PASSWORD:</p>
                          <input
                              type='password'
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              name='password'
                              autoComplete='current-password'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <Button variant='primary' type='submit' onClick={appLogin}>
                          {loggedIn ? 'LOGOUT' : 'LOGIN'}
                      </Button>
                  </Col>
              </Row>
          </form>
    </section>
      </div>
  )
}
