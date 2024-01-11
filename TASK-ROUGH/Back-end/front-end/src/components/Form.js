import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//TaskForm function component
export default function TaskForm (
  { 
    username, 
    taskInput, 
    setUsername, 
    setTaskInput, 
    addTask 
  }
  ) {

  //==============JSX RENDERING==============

  return (
    // Form to add a newTask
    <form id='taskForm' onSubmit={addTask}>
      <Row className='formRow'>
        <Col className='formCol'>
          {/* Username input */}
          <label className='formLabel'>
            <p>USERNAME:</p>
            <input
              className='formInput'
              type='email'
              name='username'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </Col>
        <Col className='formCol'>
          {/* Task Input */}
          <label className='formLabel'>
            <p>TASK:</p>
            <input
              className='formInput'
              type='text'
              name='taskInput'
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
          </label>
        </Col>
        <Col className='formCol'>
          <Button type='submit' variant='primary'>
            ADD TASK
          </Button>
        </Col>
      </Row>
    </form>
  );
};


