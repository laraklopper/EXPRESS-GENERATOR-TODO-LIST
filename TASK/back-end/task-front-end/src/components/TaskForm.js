import React from 'react';// Import the React module to use React functionalities
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//TaskForm function component
export default function TaskForm(//Export default TaskForm function component
    { //Props
        addTask, 
        taskInput, 
        setTaskInput
    }) {

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
                    <Button type="submit" variant="primary" id='addTaskBtn' onClick={addTask}>
                        ADD TASK
                    </Button>
                    </Col>
                    <Col className='formCol'>
                    </Col>
                </Row> 
            </Form>
        </div>
    );
}