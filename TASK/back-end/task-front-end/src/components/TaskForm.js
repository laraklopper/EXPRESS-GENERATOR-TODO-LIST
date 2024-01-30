import React, { useState } from 'react';// Import the React module to use React functionalities
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//TaskForm function component
export default function TaskForm(//Export default TaskForm function component
    { //=======PROPS PASSED FROM THE PARENT COMPONENT==========
        setTaskData, 
        setError, 
       
    }) {
        //=======STATE VARIABLES===============
        const [newTask, setNewTask] = useState({
            username: '',
            title: '',
        })

    //==============REQUESTS====================
    //--------------POST REQUEST---------------------------
    //Function to add a task
    const addTask = async (newTask) => {
        try {
            const token = localStorage.getItem('token');//Retrieve the authentication from localStorage
            // Make a POST request to the server
            const response = await fetch('http://localhost:3001/addTask', {
                method: 'POST',//Request method
                mode: "cors",// Set the mode to 'cors'(cross-origin resource sharing), indicating that the request is a cross-origin request.
                headers: {
                    'Content-type': 'application/json',//Specify the content type
                    'Authorization': `Bearer ${token}`,//Authorization header as the bearer token
                },
                body: JSON.stringify({ username: newTask.username, title: newTask.title }),
            });

            // Conditional rendering to check if the server response is in the successful range (200-299)
            if (response.status >= 200 && response.status < 300) {
                // If successful, parse the response JSON and update the taskData state
                const updatedList = await response.json();
                setTaskData(updatedList);
                // Update the local storage with the updated taskData
                localStorage.setItem('tasks', JSON.stringify(updatedList));
                console.log('Task added successfully');//Log a success message in the console
            }
            else {
                throw new Error('Failed to add task');//Throw an error message if the POST request is unsuccessful
            }
        }
        catch (error) {
            // Handle any errors that occur during the request
            console.error('Error adding task:', error.message);//Display a error message in the console for debugging purposes
            setError('Error adding task', error.message);//Set the error state
            // localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
        }
    };

    

    //Function to handle input change in the taskForm
    const handleTaskInput = (event) => {
        const {name, value} = event.target;
        setNewTask ((prevData) => ({
            ...prevData,
            [name]:value
        }))
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