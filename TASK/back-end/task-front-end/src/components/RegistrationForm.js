import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col'; // Import Bootstrap Column component
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//Registration Form function component
export default function RegistrationForm(//Export default registrationForm function component
    // Props to extract specific properties
    {
        newUsername,
        setNewUsername,
        addUser,
        setNewPassword,
        newPassword

    }) {

    //====================JSX RENDERING=========================

    return (
        <div>
            {/* Header Row */}
            <Row className='regisFormRow'>
                <Col>
                    <h2 className='h2'>REGISTER</h2>
                </Col>
            </Row>
            {/* Registration form */}
            <form onSubmit={addUser} id='registrationForm'>
                <Row className='regisFormRow'>
                    {/* Username Input */}
                    <Col className='regisFormCol'>
                        <label className='regisLabel'>
                            <p className='labelText'>USERNAME:</p>
                            <input
                                type='text'
                                name='newUsername'
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                                className='regisInput'
                            />
                        </label>
                    </Col>
                    {/* Password Input */}
                    <Col className='regisFormCol'>
                        <label className='regisLabel'>
                            <p className='labelText'>PASSWORD:</p>
                            <input
                                name='newPassword'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type='password'
                                required
                                className='regisInput'
                            />
                        </label>
                    </Col>
                    <Col>
                        {/* Submit button */}
                        <Button variant='primary' type='submit' id='registrationBtn'>REGISTER</Button>
                    </Col>
                </Row>
            </form>
        </div>
    )
}