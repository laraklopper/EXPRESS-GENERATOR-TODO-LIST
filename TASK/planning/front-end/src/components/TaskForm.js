import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//TaskForm function component
export default function TaskForm(
    {//=======PROPS PASSED FROM THE PARENT COMPONENT==========
        addTask, 
        newTask,
        setNewTask,
    }
) {

    //=============JSX RENDERING===========

  return (
      <div id='form'>
          <Row className='formRow'>
              <Col className='formCol'>
                  <h3 className='h3'>ADD TASK</h3>
              </Col>
          </Row>
          <form id='newTaskForm' onSubmit={addTask}>
              <Row className='formRow'>
                  <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                          <p className='labelText'>USER:</p>
                          <input
                              type='text'
                              value={newTask.user}
                              onChange={(e) => setNewTask({ ...newTask, user: e.target.value })}
                              placeholder='USER'
                              className='formInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                          <p className='labelText'>TASK TITLE:</p>
                          <input
                              type='text'
                              value={newTask.newTaskTitle}
                              onChange={(e) => setNewTask({ ...newTask, newTaskTitle: e.target.value })}
                              placeholder='TASK TITLE'
                              className='formInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4} className='formCol'>
                      <Button variant="primary" type="submit" id='addTaskBtn'>
                          ADD TASK
                      </Button>
                  </Col>
              </Row>
          </form>
      </div>
  )
}
