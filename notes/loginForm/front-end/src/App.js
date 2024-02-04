import React, { useState } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [error, setError] = useState('');

  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        console.log('Successfully logged in');
        setLogin(true);
        setLoginStatus(true);
        localStorage.setItem('loginStatus', JSON.stringify(true));
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login Failed', error.message);
      setError(`Login Failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => { e.preventDefault(); submitLogin(); }}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
