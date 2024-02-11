import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//LogoutBtn function component
export default function LogoutBtn(//Export default LogoutBtn function component
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
        logout
    }
) {

    //========JSX RENDERING================
    return (
        <div id='logout'>
            <Row className='row'>
                <Col className='col'>
                    {/* Button to Logout */}
                    <Button variant="primary" onClick={logout} id='logoutBtn'>
                        Logout
                    </Button>
                </Col>
            </Row>
        </div>
    )
}