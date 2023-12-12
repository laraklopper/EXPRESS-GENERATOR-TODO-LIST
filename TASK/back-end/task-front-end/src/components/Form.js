import React  from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//TaskForm function component
export default function TaskForm({ addTask, taskInput, setTaskInput }) {

//===========JSX RENDERING==================

    return (
        <div id='form'>
            <Row id='formHeader'>
                <Col>
                    <h3 className='h3'>ADD TASK</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={addTask} id='taskForm'>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control
                                placeholder="Add new task here..."
                                type='text'
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                            />
                            <Button type="submit" variant="primary">
                                ADD TASK
                            </Button>
                        </Stack>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}
