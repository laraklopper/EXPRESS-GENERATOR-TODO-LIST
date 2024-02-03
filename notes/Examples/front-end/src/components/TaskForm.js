import React from 'react';// Import the React module to use React functionalities
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//TaskForm function component
export default function TaskForm(//Export default TaskForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        addTask, newTask, setNewTask
    }) {
        

    //============Event Listeners================

    // Function to handle input changes in the taskForm
    const handleTaskInput = (event) => {
        const { name, value } = event.target; // Extract 'name' and 'value' properties from the event target (input element)

        setNewTask((prevData) => ({// Update the 'newTask' state using the setNewTask function
            ...prevData, // The new state is derived from the previous state (prevData) using the spread operator
            [name]: value // The property specified by 'name' is updated with the new 'value'
        }));
    }

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
                            onChange={handleTaskInput}
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
                        onChange={handleTaskInput}
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
