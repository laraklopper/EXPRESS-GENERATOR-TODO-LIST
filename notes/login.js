import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const { token } = await response.json(); // Assuming the token is returned in the response body
      setToken(token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Change password failed:', error);
    }
  };

  return (
    <div>
      <form>
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <div>
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
