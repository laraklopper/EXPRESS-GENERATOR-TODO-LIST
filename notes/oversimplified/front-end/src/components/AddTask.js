import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function AddTask({addTask, newTask, setNewTask}) {
  return (
    <div>
      <Row>
        <Col><h3 className='h3'>ADD TASK</h3></Col>
      </Row>
      <form onSubmit={addTask}>
        <Row>
          <Col xs={6} md={4} className='formCol'>
            <label>
              <p>USER</p>
              <input
                type='text'
                value={newTask.user}
                onChange={(e) => setNewTask({ ...newTask, user: e.target.value })}
                autoComplete='off'
                placeholder='USER'
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='formCol'>
            <label>
              <p>TITLE:</p>
              <input
                type='text'
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                autoComplete='off'
                className='formInput'
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
