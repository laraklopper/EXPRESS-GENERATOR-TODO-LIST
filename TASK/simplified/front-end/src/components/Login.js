import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Login function component
export default function Login(
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
        userData, 
        setUserData,
        submitLogin,
        appLogin,
        loggedIn
    }) {

   
    //==============JSX RENDERING=================

  return (
      <div id='loginPage'>
          <Row className='loginRow'>
              <Col className='loginCol'>
                  <h3 className='h3'>ENTER LOGIN DETAILS</h3>
              </Col>
          </Row>
          <form id='loginForm' onSubmit={submitLogin}>
              <Row className='loginRow'>
                  <Col xs={6} md={4} className='loginCol'>
                      <label className='loginLabel' htmlFor='username'>
                          <p className='labelText'>USERNAME:</p>
                          <input
                              type='text'
                                value={userData.username}
                              onChange={(e) => setUserData({ ...userData,  
                                username: e.target.value })}
                              className='loginInput'
                              placeholder='USERNAME'
                              id='username'
                              autoComplete='off'
                              name='username'
                          />
                          {/* {console.log(userData.username)} */}
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <label className='loginLabel' htmlFor='password'>
                          <p className='labelText'>PASSWORD:</p>
                          <input
                              type='password'
                                value={userData.password}
                              onChange={(e) => setUserData({ ...userData, 
                                password: e.target.value })}
                              className='loginInput'
                              id='password'
                              placeholder='PASSWORD'
                              autoComplete='current-password'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <Button variant="primary" type="submit" 
                      id='loginBtn' onClick={appLogin}>
                          {loggedIn ? 'LOGOUT' : 'LOGIN'}
                      </Button>
                  </Col>
              </Row>
          </form>
      </div>
  )
}
