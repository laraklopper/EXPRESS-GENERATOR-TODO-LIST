// Import React and necessary components from Bootstrap
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from './Header';// Import the Header component from './components/Header'

//Register function component
export default function Registration(//Export default Registration function component
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
        newUserData, 
        setNewUserData, 
        addUser
    }) {

    //=========JSX RENDERING============

  return (
    <div>
      {/* Header */}
        <Header heading='REGISTRATION'/>
        <section className='section1'>
          <Row>
              <Col><h3 className='h3'>ENTER DETAILS</h3></Col>
          </Row>
          </section>
          <section className='section2'>
          <form onSubmit={addUser} id='registrationForm'>
              <Row className='regisRow'>
                  <Col xs={6} md={4} className='regisCol'>
                    {/* Username input */}
                      <label className='regisLabel'>
                          <p className='labelText'>USERNAME</p>
                            <input
                              type='text' 
                              value={newUserData.newUsername} 
                              onChange={(e) => setNewUserData(
                                { ...newUserData, newUsername: e.target.value })} 
                              autoComplete='off' 
                              name='newUsername'
                              className='regisInput' 
                            />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                    {/* password input */}
                      <label className='regisLabel'>
                          <p className='labelText'>PASSWORD:</p>
                            <input
                              type='password' 
                              value={newUserData.newPassword} 
                              onChange={(e) => setNewUserData(
                                { ...newUserData, newPassword: e.target.value })} 
                              autoComplete='off' 
                              name='newPassword'
                              className='regisInput' 
                            />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                    {/* Registration button */}
                      <Button variant="primary" id='registrationBtn' type='submit'>
                        REGISTER
                      </Button>
                  </Col>
              </Row>
          </form>
          </section>
    </div>
  )
}
