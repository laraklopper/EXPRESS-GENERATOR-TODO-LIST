import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//RegistrationForm function component
export default function RegistrationForm({newUsername, setNewUsername, newPassword, setNewPassword, addUser}) {

//================JSX RENDERING==================

    return (
        <div id='registration'>
            <Row>
                <Col>
                    <h2 className='h2'>REGISTRATION</h2>
                </Col>
            </Row>
            <Form onSubmit={addUser}>
                <Row>
                    <Col>
                        <label>
                            <p className='labelText'>USERNAME:</p>
                            <Form.Control
                                placeholder="username"
                                className='regisInput'
                                type="email"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </label>
                    </Col>
                    <Col>
                        <label>
                            <p className='labelText'>PASSWORD:</p>
                            <Form.Control
                                type='password'
                                placeholder="password"
                                className='regisInput'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">
                            ADD USER
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
