import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function TaskForm({
    newTask,
    setNewTask,
    addTask
}) {


    const handleTaskInput = (event) => {
        const { name, value } = event.target
        setNewTask((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
  return (
      <div id='form'>
          <Row className='formRow'>
              <Col className='formCol'>
                  <h2 className='h2'>ADD TASK</h2>
              </Col>
          </Row>
          <form onSubmit={addTask}>
              <Row className='formROw'>
                  <Col xs={6} md={4} className='formCol'>
                      <label className='formLabel'>
                          <p className='labelText'>USER:</p>
                          <input
                              type='text'
                              name='username'
                              value={newTask.username}
                              onChange={handleTaskInput}
                              placeholder='username'
                              autoComplete='on'
                              className='taskInput'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <label className='formLabel'>
                          <p className='labelText'>TITLE:</p>
                          <input
                              type='text'
                              name='title'
                              value={newTask.title}
                              onChange={handleTaskInput}
                              placeholder='task'
                              className='taskInput'
                              autoComplete='on'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <Button variant="primary" type="submit" id='addTaskBtn'>
                          ADD TASK
                      </Button>
                  </Col>
              </Row>
          </form>
      </div>
  )
}
