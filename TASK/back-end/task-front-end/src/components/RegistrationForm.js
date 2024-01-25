import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import FormHeadings from './FormHeadings';//Import FormHeadings function component

//RegistrationForm function component
export default function RegistrationForm(//Import default RegistrationForm function component
    { //Props  
        addUser, 
        newUsername, 
        setNewUsername, 
        newPassword, 
        setNewPassword
    }) 
    {

  
    //================JSX RENDERING==================

    return (
        // Registration Form
        <div id='registration'>
            <FormHeadings headingText="REGISTER"/>
            {/* RegistrationForm */}
            <Form onSubmit={addUser} id='registrationForm'>
                <Row className='regisRow'>
                    {/* Username */}
                    <Col xs={6} md={4} className='regisCol'>
                        <label className='regisLabel'><p className='labelText'>USERNAME:</p> </label>
                            <Form.Control
                                placeholder="username"
                                className='regisInput'
                                type="email"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
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
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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