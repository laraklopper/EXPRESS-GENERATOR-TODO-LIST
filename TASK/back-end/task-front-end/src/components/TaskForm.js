import React from 'react';
//Bootstrap
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//TaskForm function component
export default function TaskForm(//Export default TaskForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        addTask,
        newTask,
        setNewTask
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
                            <p className='labelText'>USER</p>
                            <Form.Control
                                placeholder="username"
                                type='text'
                                name='username'                                
                                value={newTask.username}
                                onChange={(e) => setNewTask({ ...newTask, user: e.target.value })}
                            className='taskInput'
                            />
                        </label>
                    </Col>
                    <Col>
                        <Row>
                            <Col className=''>
                                <label className='formLabel'>
                                    <p className='labelText'>TASK:</p>
                                    <Form.Control
                                        placeholder='Task'
                                        type='text'
                                        name='title'
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, newTaskTitle: e.target.value })}
                                    className='taskInput'
                        />
                                </label>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='formCol'>
                        <Button type="submit" variant="primary" id='addTaskBtn'>
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