// Import React and necessary components from Bootstrap
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 

//AddTask function component
export default function AddTask(//Export default addTask function component
    {//=========PROPS PASSED FROM PARENT COMPONENT===========
        setNewTask,
        addTask//async function to add a new task
        
    }) 
    {

  const handleInputChange = (event) => {
    const { name, value } = event.target;  // Extract the name and value from the event target (input element)

    setNewTask((prevData) => ({ 
      ...prevData,  
      // Spread the previous state to keep existing values

      [name]: value,    // Update the value of the specified input field
    }));
  };

  
    //=========JSX RENDERING============
    
  return (
    <div id='addTask'>
        <Row>
        <Col><h3 className='h3'>ENTER NEW TASK DETAILS</h3></Col>
        </Row>
        <form onSubmit={addTask} id='form'>
              <Row>
                {/* Input for task user */}
                  <Col xs={6} md={4}>
                     <label htmlFor='user' className='formLabel'>
                        <p className='labelText'>TASK USER:</p>
                        <input
                              type='text'
                          // value={newTask.user}
                              // onChange={(e) => setNewTask({...newTask, 
                              //   user: e.target.value})}
                              onChange={handleInputChange}
                              autoComplete='off'
                              name='user'
                              id='user'
                              className='formInput'
                              placeholder='USER'
                        />
                     </label>
                  </Col>
                  {/* Input for task title */}
                  <Col xs={6} md={4} className='formCol'>
                      <label htmlFor='title' className='formLabel'>
                          <p className='labelText'>TASK TITLE:</p>
                          <input 
                              type='text'
                              // value={newTask.title}
                              // onChange={(e) => setNewTask({...newTask,
                              //    title: e.target.value })}
                              onChange={handleInputChange}
                              autoComplete='off'
                              name='title'
                              id='title'
                              className='formInput'
                              placeholder='TASK TITLE'
                          />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                    {/* Button to add a new task */}
                      <Button variant="primary" type='submit'>
                          ADD TASK
                      </Button>
                  </Col>
              </Row>
        </form>
    </div>
  )
}
