# TOGGLE PAGE

## TOGGLE PAGE

```jsx
// Import necessary dependencies and components
import React from 'react';
import RegistrationForm from './RegistrationForm'; // Import RegistrationForm component
import LoginForm from './LoginForm'; // Import LoginForm component
import ToggleBtn from './ToggleBtn'; // Import ToggleBtn component

// Create a new functional component named Section1
export default function TogglePage({
  isRegistration,
  setIsRegistration,
  setNewPassword,
  newPassword,
  newUsername,
  setNewUsername,
  password,
  setPassword,
  username,
  setUsername,
  submitLogin,
  login,
  handleLogoutClick,
  appLogin,
}){

//=============JSX RENDERING=================
  return (
    <div>
      {/* Toggle between the login and registration page */}
      {isRegistration ? (
        // Registration form
        <RegistrationForm
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          addUser={addUser}
        />
      ) : (
        // Login Form
        <LoginForm
          submitLogin={submitLogin}
          login={login}
          handleLogoutClick={handleLogoutClick}
          setUsername={setUsername}
          setPassword={setPassword}
          username={username}
          password={password}
          appLogin={appLogin}
        />
      )}
      {/* Toggle Button */}
      <ToggleBtn
        isRegistration={isRegistration}
        setIsRegistration={setIsRegistration}
        setNewPassword={setNewPassword}
        newPassword={newPassword}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
};


```

## APP.JS
```jsx
// Import Section1 component
import TogglePage from './TogglePage/components';

// ...

return (
  // AppContianer
  <>
    <Container id='appContainer'>
      {/* Header */}
      <Header />
      {loginStatus ? (
        // Section1 component
        <Section1
          isRegistration={isRegistration}
          setIsRegistration={setIsRegistration}
          setNewPassword={setNewPassword}
          newPassword={newPassword}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          password={password}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
          submitLogin={submitLogin}
          login={login}
          handleLogoutClick={handleLogoutClick}
          appLogin={appLogin}
        />
      ) : (
        // Section2
        <section id='section2'>
           {/* Form to add new Tasks */}
          <TaskForm addTask={addTask} taskInput={taskInput} setTaskInput={setTaskInput} />
          {error ? (
            <div>{error}</div>
          ) : !isLoaded ? (
            <p>Loading...</p>
          ) : (
            <div>
            <ul>
              {/* Display the Tasks */}
              {taskData.map((task) => (
                <li key={task.taskId} id='tasks'>
                  <div>
                    {task.taskId}
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => editTask(task.taskId)}>
                      EDIT
                    </Button>
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => deleteTask(task.taskId)}>
                      DELETE
                    </Button>
                  </div>
                </li>
               
              ))}
            </ul>
             
             </div>
          )}
          <Row>
            <Col>
            {/* Button to Logout */}
              <Button variant="primary" onClick={logout}>
                Logout
              </Button>
            </Col>
          </Row>
        </section>
      )}
    </Container>
  </>
);
```
