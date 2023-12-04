# REACT HOOK FORM

Install `react-hook-form`

```bash
npm install react-hook-form
```

## LOGIN FORM

`LoginForm` component to integrate React Hook Form:

```javascript
import React from 'react';
import { useForm } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function LoginForm({
  submitLogin,
  appLogin,
  handleLogout,
  login,
}) {
  // React Hook Form setup
  const { register, handleSubmit, setValue } = useForm();

  // Form submission handler
  const onSubmit = (data) => {
    // Call your existing submitLogin function with the form data
    submitLogin(data);
  };

  // JSX rendering
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="loginForm">
      <Row className="loginRow">
        <Col className="loginCol">
          <label className="loginLabel">
            <p className="labelText">Username</p>
            <input
              type="email"
              name="username"
              value={register('username', { required: true })}
              onChange={(e) => setValue('username', e.target.value)}
              className="input"
            />
          </label>
        </Col>

        <Col className="loginCol">
          <label className="loginLabel">
            <p className="labelText">Password</p>
            <input
              type="password"
              name="password"
              value={register('password', { required: true })}
              onChange={(e) => setValue('password', e.target.value)}
              className="input"
            />
          </label>
        </Col>

        <Col className="loginCol">
          <Button
            type="button"
            onClick={login ? handleLogout : handleSubmit(onSubmit)}
            variant={login ? 'danger' : 'primary'}
          >
            {login ? 'Logout' : 'Login'}
          </Button>
        </Col>
      </Row>
    </form>
  );
}
```
