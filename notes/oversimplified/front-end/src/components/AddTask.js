import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function AddTask({addTask, newTaskUser, setNewTaskUser, newTaskTitle, setNewTaskTitle}) {
    
  return (
      <section>
          <Row>
              <Col>ADD TASK:</Col>
          </Row>
          <Row>
              <Col><h3 className='h3'>ENTER TASK DETAILS</h3></Col>
          </Row>
          <form onSubmit={addTask}>
              <Row>
                  <Col xs={6} md={4}>
                      <label className='formLabel'>
                          <p className='labelText'>USER</p>
                          <input
                              className='formInput'
                              type='text'
                              value={newTaskUser}
                              onChange={(e) => setNewTaskUser(e.target.value)}
                              placeholder='USER'
                              name='newTaskUser'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <label className='formLabel'>
                          <p className='labelText'>TASK TITLE</p>
                          <input
                              type='text'
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              name='newTaskTitle'
                              placeholder='TASK TITLE'
                              className='formInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <Button variant="primary" type='submit'>Add Task</Button>
                  </Col>
              </Row>
          </form>
      </section>
  )
}
