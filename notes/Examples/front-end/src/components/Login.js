import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Login({
    userData,
    setUserData,
    submitLogin

})

{
    const handleLoginChange = (event) =>{
        const {name, value} = event.target
        setUserData((prevData) => ({
            ...prevData,
            [name]:value
        }))
    }

  return (
    <div>
        <Row>
            <Col>
                 <h2>LOGIN</h2>            
            </Col>
        </Row>
        <form onSubmit={submitLogin}>
              <Row className='loginRow'>
                  <Col xs={6} md={4}>
                      <label>
                        <p className='labelText'>USERNAME:</p>
                        <input
                        type='text'
                        name='username'
                        value={userData.username}
                        onChange={handleLoginChange}
                        className='loginInput'
                        autoComplete='on'
                        placeholder='username'
                        />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <label>
                        <p className='labelText'>PASSWORD:</p>
                        <input
                        type='text'
                        name='password'
                        value={userData.password}
                        onChange={handleLoginChange}
                        className='loginInput'
                        autoComplete='on'
                        placeholder='password'
                        />
                      </label>
                  </Col>
                  <Col xs={6} md={4}>
                      <Button variant="primary" type='submit'>LOGIN</Button>
                  </Col>
              </Row>
        </form>
    </div>
  )
}
