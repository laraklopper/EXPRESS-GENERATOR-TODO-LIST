import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Header from './Header';

//Login Function Component
export default function Login(
  {//====PROPS PASSED FROM PARENT COMPONENT=====
  submitLogin,
  userData,
  setUserData,
  appLogin,
  loggedIn
}) {

  //=======JSX RENDERING===========

  return (
    <div>
      <Header heading="LOGIN" />
      <section className='section1'>
        <form onSubmit={submitLogin}>
          <Row>
            <Col xs={6} md={4} className='loginCol'>
              <label>
                <p>USERNAME:</p>
                <input
                  type='text'
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  name='username'
                  placeholder='USERNAME'
                  autoComplete='off'
                  className='loginInput'
                />
              </label>
            </Col>
            <Col xs={6} md={4} className='col'>
              <label>
                <p className='labelText'>PASSWORD</p>
                <input
                  type='password'
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  name='password'
                  placeholder='PASSWORD'
                  autoComplete='off'
                  className='loginInput'
                />
              </label>
            </Col>
            <Col xs={6} md={4}>
              <Button variant="primary" type='submit' onClick={appLogin}>
                {loggedIn ? 'LOGOUT' : 'LOGIN'}
              </Button>
            </Col>
          </Row>
        </form>
      </section>
    </div>
  )
}

