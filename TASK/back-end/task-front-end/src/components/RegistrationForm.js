import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col'; // Import Bootstrap Column component
import { useForm } from 'react-hook-form';//Import the react hook form component
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//Registration Form function component
export default function Register(//Export default registrationForm function component
    // Props to extract specific properties
    {
    addUser,
    newUsername,
    setNewUsername,
    newPassword,
    setNewPassword
}) {
    // Destructure methods and state from useForm hook
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Define the onSubmit function to handle form submission
    const onSubmit = async (data) => {

        localStorage.setItem(data.newUsername, JSON.stringify({// Store user data in localStorage
            name: data.newUsername,
            password: data.newPassword,
        }));

        await addUser(); // Call the addUser function to make the API request

        // Reset input fields after successful form submission
        setNewUsername(''); // Reset newUsername state to an empty string
        setNewPassword(''); // Reset newPassword state to an empty string

    };

    //===============JSX RENDERING======================

    return (
        <div>
            {/* Header Row */}
            <Row className='regisFormRow'>
                <Col>
                    <h2 className='h2'>REGISTER</h2>
                </Col>
            </Row>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row className='regisFormRow'>
                    <Col className='regisFormCol'>
                        {/* Username Input */}
                        <label className='regisLabel'>
                            <p className='labelText'>USERNAME:</p>
                            <input
                                className='regisInput'
                                type='text'
                                name='newUsername'
                                {...register("newUsername", { required: true })}
                                placeholder='username'
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            {errors.newUsername && <span className="error">Username is required</span>}

                        </label>

                    </Col>
                    <Col className='regisFormCol'>
                        {/* Password Input */}
                        <label className='regisLabel'>
                            <p className='labelText'>PASSWORD:</p>
                            <input
                                className='regisInput'
                                type='password'
                                name='newPassword'
                                {...register("test", { required: true })}
                                placeholder='password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {errors.newPassword && <span className="error">Password is required</span>}

                        </label>

                    </Col>
                    <Col className='regisFormCol'>
                        {/* Submit button */}
                        <Button variant='primary' type='submit' id='regisBtn'>REGISTER:</Button>
                    </Col>

                </Row>

            </form>
        </div>
    )
}
