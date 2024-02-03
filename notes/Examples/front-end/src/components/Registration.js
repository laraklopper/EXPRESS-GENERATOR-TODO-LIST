import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library

//RegistrationForm function component
export default function RegistrationForm(//Import default RegistrationForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        addUser,
        setNewUserData,
        newUserData
    }) 
    {
  
    //============Event Listeners================

    //Function to handle input changes in the RegistrationForm
      const handleRegistrationChange = (event) => {
        const {name, value} = event.target;
        setNewUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
      }
  
    //================JSX RENDERING==================

    return (
        // Registration Form
        <div id='registration'>
            <Row className='regisRow'>
                <Col className='regisCol'>
                <h2 className='h2'>REGISTRATION</h2>
                </Col>
            </Row>
            {/* RegistrationForm */}
            <Form onSubmit={addUser} id='registrationForm'>
                <Row className='regisRow'>
                    {/* Username */}
                    <Col xs={6} md={4} className='regisCol'>
                        <label className='regisLabel'><p className='labelText'>USERNAME:</p> </label>
                            <Form.Control
                                placeholder="username"
                                className='regisInput'
                                type="text"
                                value={newUserData.newUsername}
                                onChange={handleRegistrationChange}
                                autoComplete='on'
                            />                      
                    </Col>
                    <Col xs={6} md={4} className='regisCol'>
                        {/* Password input */}
                        <label className='regisLabel'>
                            <p className='labelText'>PASSWORD:</p></label>
                            <Form.Control
                                type='password'
                                placeholder="password"
                                className='regisInput'
                                value={newUserData.newPassword}
                                onChange={handleRegistrationChange}
                                autoComplete='on'
                            />                    
                    </Col>
                    <Col xs={6} md={4} className='regisCol'>
                        <Button variant="primary" type="submit" id='registrationBtn'>
                            ADD USER
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
