import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col'; // Import Bootstrap Column component
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
    // Props to extract specific properties
    {
        submitLogin,   // onSubmit Function to handle form submission
        username,      // State variable for username
        setUsername,   // Function to set the username state
        password,      // State variable for password
        setPassword,   // Function to set the password state
        appLogin,      // Function to handle application-level login/logout
        handleLogout,  // Function to handle form after logging out
        login          // Boolean state indicating whether the user is logged in
    }) {

    //=============JSX RENDERING=========================

    return (
        <div id='login'>
            <Row id='loginHeading'>
                <Col><h2 className='h2'>LOGIN</h2></Col>
            </Row>
        <form onSubmit={submitLogin} id='loginForm'>
            <Row className='loginRow'>
                {/* Column for Username input */}
                <Col className='loginCol'>
                    <label className='loginLabel'>
                        {/* Label for the Username input field */}
                        <p className='labelText'>Username</p>
                        {/* Input field for the username */}
                        <input
                            type="email"
                            name='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='input'
                            placeholder='username'
                        />
                    </label>
                </Col>
                {/* Column for Password input */}
                <Col className='loginCol'>
                    <label className='loginLabel'>
                        {/* Label for the Password input field */}
                        <p className='labelText'>Password</p>
                        {/* Input field for the password */}
                        <input
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input'
                            placeholder='password'
                        />
                    </label>
                </Col>

                {/* Column for Login/Logout button */}
                <Col className='loginCol'>
                    {/* Button with onClick event for login/logout functionality */}
                    <Button type="button" onClick={login ? handleLogout : appLogin} variant={login ? "danger" : "primary"}>
                    {/* <Button type="submit" onClick={appLogin} variant={login ? "danger" : "primary"}> */}
                        {/* Text based on login state */}
                        {login ? "Logout" : "Login"}
                    </Button>
                </Col>
                <Col></Col>
            </Row>
        </form>
        </div>
    )
}