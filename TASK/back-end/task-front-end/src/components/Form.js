import React from 'react'; // Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col'; // Import Bootstrap Column component
import Button from 'react-bootstrap/Button'; // Import Button component from Bootstrap library

// Form function component
export default function Form({ addTask, tasks, setTasks }) {

    //=================JSX RENDERING==================

    return (
        // Form for adding tasks
        <form className='form' onSubmit={addTask}>
            {/* Row to structure the form */}
            <Row>
                {/* Column for the task input */}
                <Col>
                    <label className='formLabel'>
                        {/* Label for the task input */}
                        <p className='formText'>ADD TASK:</p>
                        {/* Input field for entering the task */}
                        <input
                            type='text'
                            value={tasks}
                            onChange={(e) => setTasks(e.target.value)}
                            className='input'
                        />
                    </label>
                </Col>
                {/* Column for the Add Task button */}
                <Col>
                    {/* Button to submit the form and add a task */}
                    <Button variant='primary' type='submit'>
                        ADD TASK
                    </Button>
                </Col>
            </Row>
        </form>
    );
}
