import React, {useEffect} from 'react';// Import the React module to use React functionalities
import Form from 'react-bootstrap/Form';// Import Form component from bootstrap library
import Col from 'react-bootstrap/Col';//Import bootstrap coloumn
import Row from 'react-bootstrap/Row';//Import bootstrap row 
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//TaskForm function component
export default function TaskForm(//Export default TaskForm function component
    { //Props
        taskInput, 
        setTaskInput,
        taskData,
        setTaskData,
        setError
    }) {

    //useEffect hook used to retrieve and update Task Data from localStorage
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');  // Retrieve tasks from localStorage

        // Conditional rendering to check if the tasks are present in localStorage
        if (storedTasks) {
            setTaskData(JSON.parse(storedTasks));// If present, parse the JSON and update the taskData state
        }
    }, [taskData,setTaskData]);
    /* The useEffect hook takes a second argument, which is an array of dependencies. 
    The [taskData] means that the effect will run whenever the taskData state changes.*/

    //==============REQUESTS====================
    //--------------POST REQUEST---------------------------
    //Function to add a task
    const addTask = async (taskInput) => {
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
                body: JSON.stringify({ value: taskInput }),
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
            localStorage.removeItem('token');//Remove the token from local storage if an error occurs.
        }
    };
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