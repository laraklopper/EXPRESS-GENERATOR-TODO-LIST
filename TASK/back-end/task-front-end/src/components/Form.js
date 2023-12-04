import React from 'react';// Import the React module to use React functionalities
import { useForm } from 'react-hook-form';//Import the react hook form component
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col';// Import Bootstrap Column component
import Button from 'react-bootstrap/Button';// Import button component from bootstrap library

//Form Function component
export default function Form(//Export default form function component
    // Props to extract specific properties
    { 
        addTask, //Function to add tasks
        taskInput, //State to store task input
        setTaskInput //State to store changes in task input
    }) 
    {
    // Destructure methods from the useForm hook
    const { register, handleSubmit, reset } = useForm("");


    //=========FUNCTIONS==============
    
    // Function to be called on form submission
    const onSubmit = (data) => {
        addTask(data.task); // Call the addTask function with the task data
        reset(); // Reset the form after submission
    }
    //===============JSX RENDERING==============

    return (
        // Form for adding tasks
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row className='formRow'>
                <Col className='form col'>
                    {/* Form input */}
                    <label className='formLabel'>{/* Label for the task input */}
                        <p className='formText'>ADD TASK:</p>
                        {/* Input field for entering the task */}
                        <input
                            type='text'
                            {...register('task', { required: true })}
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className='input'
                        />
                    </label>

                </Col>
                <Col className='formCol'>
                    {/* Button to submit the form and add a task */}
                    <Button variant="primary" type="submit" id='formBtn'>
                        ADD TASK
                    </Button>
                </Col>

            </Row>
        </form>
    )
}
