import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//UpdateForm function component
export default function UpdateForm(//Export default UpdateForm function component
  { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
    editTask,
    newUser,
    setNewUser,
    newTitle, 
    setNewTitle

}) {

  //============JSX RENDERING===============

  return (
    <form onSubmit={editTask} className='updateForm'>
          <Row className='updateRow'>
              <Col xs={6} md={4} className='updateCol'>
                  <label className='updateLabel'>
                    <p className='labelText'>NEW USER:</p>
                    <input
                    type='text'
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder='newuser'
                    className='changeInput'
                    />
                  </label>
              </Col>
              <Col xs={6} md={4} className='updateCol'>
                  <label className='updateLabel'>
                      <p className='labelText'>NEW TITLE:</p>
                      <input 
                      type='text'
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className='changeInput'
                      placeholder='NEW TITLE'
                      />
                  </label>
              </Col>
              <Col xs={6} md={4} className='updateCol'>
                  <Button variant="primary" type="submit" className='editFormBtn'>
                    EDIT TASK
                  </Button>
            </Col>
          </Row>  
    </form>
  )
}
