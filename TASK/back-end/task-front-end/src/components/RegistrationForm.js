import React from 'react';// Import the React module to use React functionalities
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import FormHeadings from './FormHeadings';//Import FormHeadings function component

//RegistrationForm function component
export default function RegistrationForm(//Import default RegistrationForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        setError,
        // newUserData,
        // setNewUserData,
        newPassword,
        setNewPassword,
        newUsername,
        setNewUserName,


    }) 
    {
  
        
    //Function to add a newUser
    const addUser = async () => {//Define an async funciton to add a new User
        try {
            const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
            //Send a POST request to the server
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',//Request method
                mode: 'cors',// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
                headers: {
                    'Content-type': 'application/json',//Specify the content type
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                },
                //Request body
                body: JSON.stringify({ newUsername, newPassword}),// Send the new username and password as JSON in the request body
            });

            // Conditional rendering to check if the server response is in the successful range (200-299)
            if (response.status >= 200 && response.status < 300) {
                const data = await response.json()
                if (data.token) {
                    console.log('New user successfully added');// If successful, log a success message and update the localStorage with the new user
                    const users = JSON.parse(localStorage.getItem('users')) || [];// Retrieve existing users from localStorage or initialize an empty array
                    localStorage.setItem('users', JSON.stringify(users));      // Update the localStorage with the updated users array

                } else {
                    throw new Error ('Invalid server response')
                }
            }
            else {
                throw new Error('Failed to add new user');//Throw an error message if the POST request is unsuccessful
            }
        }
        catch (error) {
            // Handle any errors that occur during the request
            console.error('Error adding new user', error.message);//Display an error message in the console for debugging purposes
            setError("Error adding new user", error.message);// Sets the error state with an error message.
        }
    };

  
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
                                onChange={(e)=> setNewUserName(e.target.value)}
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