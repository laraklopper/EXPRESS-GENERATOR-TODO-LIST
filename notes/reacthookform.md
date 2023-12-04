# REACT HOOK FORM

**INSTALL**
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
- Import the `useForm` from `react-hook-form` and initialise it.
- Use the `onSubmit` prop with the React Hook Form's `handleSubmit` function.
- The input elements is used the `register` function from React Hook Form to bind input values and validation rules.
- The `setValue` function is used to update the form values manually.
## REGISTRATION FORM

To use React Hook Form and add local storage functionality to your registration form:

1. Install `React Hook Form`:
2. Import `useForm` hook from `react-hook-form`.
3. Use the `useForm` hook to create a form instance.
4. Use the `handleSubmit` function from React Hook Form
5. Use the `register` function to register form inputs.
6. Add validation rules using the `rules` prop.
7. Utilize the `setValue` function to set form values.

8. Implement local storage logic to store user data.


`RegistrationForm` component:

```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function RegistrationForm({
  newUsername,
  setNewUsername,
  addUser,
  setNewPassword,
  newPassword,
}) {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (data) => {
    // Store user data in local storage
    localStorage.setItem('userData', JSON.stringify(data));

    // Call addUser function 
    addUser();
  };

  return (
    <div>
      <Row className="regisFormRow">
        <Col>
          <h2 className="h2">REGISTER</h2>
        </Col>
      </Row>
      <form onSubmit={handleSubmit(onSubmit)} id="registrationForm">
        <Row className="regisFormRow">
          <Col className="regisFormCol">
            <label className="regisLabel">
              <p className="labelText">USERNAME:</p>
              <input
                type="text"
                name="newUsername"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setValue('newUsername', e.target.value);
                }}
                required
                className="regisInput"
                ref={register({ required: true })}
              />
            </label>
          </Col>
          <Col className="regisFormCol">
            <label className="regisLabel">
              <p className="labelText">PASSWORD:</p>
              <input
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setValue('newPassword', e.target.value);
                }}
                type="password"
                required
                className="regisInput"
                ref={register({ required: true })}
              />
            </label>
          </Col>
          <Col>
            <Button variant="primary" type="submit" id="registrationBtn">
              REGISTER
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
}
```

## ADD TASK FORM

```
import React from 'react';
import { useForm } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Form({ addTask }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    // Pass the task data to the addTask function
    addTask(data.task);
    // Reset the form after submitting
    reset();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col>
          <label className="formLabel">
            <p className="formText">ADD TASK:</p>
            <input
              type="text"
              {...register('task', { required: true })}
              className="input"
            />
          </label>
        </Col>
        <Col>
          <Button variant="primary" type="submit">
            ADD TASK
          </Button>
        </Col>
      </Row>
    </form>
  );
}
```
