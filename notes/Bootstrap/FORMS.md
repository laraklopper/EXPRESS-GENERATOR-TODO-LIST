# FORMS

## LOGIN FORM

```
export default function LoginForm({
  submtLogin,
  appLogin,
  username,
  setUsername,
  password,
  setPassword,
  login,
  handleLogoutClick
}) {


  return (
    <div id='login'>
      <Row className='loginRow'>
        <Col id='loginHeading'>
          <h2 className='h2'>LOGIN</h2>
        </Col>
      </Row>
      <Form onSubmit={submtLogin} id='loginForm'>
        <Row className='loginRow'>
          <Col>
            <Form.Group controlId='formUsername'>
              <Form.Label className="loginLabel"><p className='labelText'>USERNAME:</p></Form.Label>
              <Form.Control
                type='text'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
                autoComplete='on'
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='formPassword'>
              <Form.Label><p className="labelText">PASSWORD:</p></Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                autoComplete='on'
              />
            </Form.Group>
          </Col>
          <Col>
            <Button
              type='button'
              onClick={login ? handleLogoutClick : appLogin}
              variant={login ? 'danger' : 'primary'}
            >
              {login ? 'Logout' : 'Login'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}




```
