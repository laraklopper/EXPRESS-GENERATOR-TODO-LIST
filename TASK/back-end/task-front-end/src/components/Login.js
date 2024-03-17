// Import React and necessary components from Bootstrap
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from './Header';// Import the Header component from './components/Header'

//Login function component
export default function Login(//Export default Login function component
    {//====PROPS PASSED FROM THE PARENT COMPONENT=======
    submitLogin,
    userData, 
    setUserData,
    loggedIn
    }) {

 
    //=========JSX RENDERING============

  return (
    <div>
      {/* Header */}
        <Header heading='LOGIN'/>
        <section className='section1'>
          <Row className='loginRow'>
          <Col >
                  <h3 className='h3'>ENTER LOGIN DETAILS</h3>
              </Col>
          </Row>
          </section>
          <section className='section2'>
          <form onSubmit={submitLogin} id='loginForm'>
              <Row className='loginRow'>
                  <Col xs={6} md={4} className='loginCol'>
                    {/* Username input */}
                     <label className='loginLabel'>
                        <p className='labelText'>USERNAME:</p>
                        <input
                          type='text' 
                          value={userData.username}
                          autoComplete='off'
                          // name='username'
                          onChange={(e) => setUserData(
                            {...userData,username: e.target.value})}
                          className='loginInput'
                          placeholder='USERNAME'
                        />
                     </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>
                    {/* Password input */}
                      <label className='loginLabel'>
                          <p className='labelText'>PASSWORD:</p>
                          <input 
                            type='password' 
                            autoComplete='off' 
                            value={userData.password} 
                            onChange={(e) => setUserData(
                              { ...userData, password: e.target.value })} 
                            className='loginInput'
                            placeholder='PASSWORD' 
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='loginCol'>      
                  {/* Login button */}            
                    <Button variant="primary" type='submit' id='loginBtn'>            
                        {loggedIn ? 'LOGOUT' : 'LOGIN'}
                    </Button>
                </Col>
              </Row>
          </form>
          </section>       
    </div>
  )
}
