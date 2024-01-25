import React from 'react'
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

export default function LogoutBtn(
    {
        setLoginStatus,
        setLogin
    }
) {

    //==============EVENT LISTENERS=========================

    const logout = () => {
        // Reset login status 
        setLoginStatus(true);
        setLogin(false);

        localStorage.removeItem('token');//Remove the stored token from localStorage
    };

    //========JSX RENDERING================
  return (
      <div>  
        <Row>
          <Col>
              {/* Button to Logout */}
              <Button variant="primary" onClick={logout}>
                  Logout
              </Button>
          </Col>
      </Row></div>
  )
}
