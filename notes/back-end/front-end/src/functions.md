# FUNCTIONS

```
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Assuming you are using React Router for navigation

const LoginForm = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = await login(event.target);
      setUser(userData);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      {error && <p>{error.message}</p>}
      {user && <Navigate to="/dashboard" replace={true} />}
      <form onSubmit={(event) => handleSubmit(event)}>
        <input type="text" name="username" />
        <input type="password" name="password" />
      </form>
    </div>
  );
};

export default LoginForm;



```
