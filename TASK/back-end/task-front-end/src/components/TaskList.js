import React from 'react'; // Import the React module to use React functionalities
import ListGroup from 'react-bootstrap/ListGroup'; // Import ListGroup component from bootstrap library
import Button from 'react-bootstrap/Button'; // Import button component from bootstrap library

// TaskList function component
export default function TaskList({ taskData, deleteTask, editTask }) {
    
    //==============JSX RENDERING==================
    return (
        // Render a ListGroup to display a list of tasks
        <ListGroup>
            {taskData.map((item, index) => (
                // Map through each task in taskData and render a ListGroup.Item for each
                <ListGroup.Item key={index}>
                    {/* Display the task value */}
                    {item.value}
                    {/* Delete Button */}
                    <div>
                        <Button variant="primary" onClick={() => deleteTask(item.id)}>
                            DELETE
                        </Button>
                    </div>
                    {/* Edit Button */}
                    <div>
                        <Button variant="primary" onClick={() => editTask(item.id)}>
                            EDIT
                        </Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
