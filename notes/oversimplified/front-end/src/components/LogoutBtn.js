import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function LogoutBtn(
    {//=========PROPS PASSED FROM PARENT COMPONENT========
        logout
    }) {

    //==============JSX RENDERING=================

    return (
        <Row id='logoutRow'>
            <Col xs={12} md={8} className='logoutCol'></Col>
            <Col xs={6} md={4} className='logoutCol'>
                <Button variant="primary" type='button'
                    id='logoutBtn' onClick={logout}>
                    LOGOUT
                </Button>
            </Col>
        </Row>
    )
}
