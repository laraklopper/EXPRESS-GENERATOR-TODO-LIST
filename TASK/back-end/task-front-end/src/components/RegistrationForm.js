import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library


//RegistrationForm function component
export default function RegistrationForm(//Import default RegistrationForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        addUser,
        newUserData,
        setNewUserData

    }) {

    //================JSX RENDERING==================

    return (
        // Registration Form
        <div id='registration'>
            <Row className='formRow' >
                <Col md={12} className='formHeadingText'>
                    <h2 className='h2'>REGISTER</h2>
                </Col>
            </Row>
            {/* RegistrationForm */}
            <Form onSubmit={addUser} id='registrationForm'>
                <Row className='regisRow'>
                    {/* Username */}
                    <Col xs={6} md={4} className='regisCol'>
                        <label className='regisLabel'>
                            <p className='labelText'>USERNAME:</p> 
                        <Form.Control
                            placeholder="username"
                            className='regisInput'
                            type="email"
                            value={newUserData.newUsername}
                            onChange={(e) => setNewUserData(
                                {
                                    ...newUserData,
                                    newUsername: e.target.value
                                })}
                        />
                        </label>
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
                            onChange={(e) => setNewUserData(
                                { ...newUserData,
                                     newPassword: e.target.value
                                     })}
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