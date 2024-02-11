import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Login function component
export default function Login(
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
        submitLogin,
        userData,
        setUserData,
        appLogin,
        login,
        handleLogoutClick
    }
) {

    //==============JSX RENDERING===========
    
  return (
      <div id='login'>
              <Row className='loginRow'>
                  <Col className='loginCol' id='loginHeader'>
                      <h2 className='h2'>LOGIN</h2>
                  </Col>
              </Row>
          <form onSubmit={submitLogin} id='loginForm'>
              <Row className='loginRow'>
                  <Col xs={6} md={4} className='loginCol'>
                      <label className='loginLabel'>
                          <p className='labelText'>USERNAME:</p>
                          <input
                              type='text'
                              value={userData.username}
                              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                              placeholder='USERNAME'
                              className='loginInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <label className='loginLabel'>
                          <p className='labelText'>PASSWORD:</p>
                          <input
                              type='password'
                              value={userData.password}
                              onChange={(e) => setUserData(
                                { ...userData, 
                                    password: e.target.value })}
                              placeholder='PASSWORD'
                              className='loginInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                      <Button variant="primary" type="submit" id='loginBtn' onClick={login ? handleLogoutClick : appLogin}>
                          {login ? 'Logout': 'Login'}
                      </Button>

                  </Col>
              </Row>
          </form>
      </div>
  )
}
