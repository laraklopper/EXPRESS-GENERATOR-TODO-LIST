import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//AddTask function component
export default function AddTask(
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
    addTask, 
    newTask, 
    setNewTask}) {

    //==============JSX RENDERING==============
    
  return (
      <div id='form'>
          <Row className='formRow'>
              <Col className='formCol'>
                  <h3 className='h3'>ADD TASK</h3>
              </Col>
          </Row>
          <form onSubmit={addTask} id='taskform'>
              <Row className='formRow'>
                  <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                          <p className='labelText'>USER:</p>
                          <input
                              type='text' 
                              placeholder='USER'
                              value={newTask.newTaskUser}
                              onChange={(e) => 
                                setNewTask({ ...newTask, 
                                    newTaskUser: e.target.value })}
                              className='taskInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                          <p className='labelText'>TASK</p>
                          <input
                              className='taskInput'
                              type='text'
                              placeholder='task'
                              value={newTask.task}
                              onChange={(e) => 
                                setNewTask({ ...newTask, 
                                    newTaskTitle: e.target.value })}
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='formCol'>
                      <Button variant="primary" type='submit'>
                        ADD TASK
                        </Button>
                  </Col>
              </Row>
          </form>
      </div>
  )
}
