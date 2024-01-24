import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//TaskForm function component
export default function TaskForm({ addTask, taskInput, setTaskInput, username, setUsername }) {

    //===========JSX RENDERING==================

    return (
        <div id='form'>
            <Row className='formRow' >
                <Col id='formHeader'>
                    <h3 className='h3'>ADD TASK</h3>
                </Col>
            </Row>
            {/* Form to add new task */}
             <Form onSubmit={addTask} id='taskForm'>
                <Row className='formRow'>
                    <Col className='formCol'>
                        {/* Username Input */}
                       <label className='formLabel'>
                        <p className='labelText'>USERNAME:</p>
                        <Form.Control
                        type='text'
                        placeholder='username'
                        value={username}
                        onChange={(e) => setUsername (e.target.value)}
                        className='taskInput'
                        />
                       </label>
                    </Col>
                    <Col className='formCol'>
                        {/* Task Input */}
                       <label className='formLabel'>
                        <p className='labelText'>TASK</p>
                        <Form.Control
                            placeholder="task"
                            type='text'
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className='taskInput'
                            /> 
                       </label>                            
                  </Col>
                    <Col className='formCol'>
                    <Button type="submit" variant="primary" id='addTaskBtn'>
                        ADD TASK
                    </Button>
                    </Col>
                </Row> 
            </Form>
        </div>
    );
}