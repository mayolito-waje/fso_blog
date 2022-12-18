import { useState } from 'react';
import blogService from '../services/blogs';
import loginService from '../services/login';

function Login({ updateUser, handleError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const credentials = { username, password };
      const user = await loginService.login(credentials);

      window.localStorage.setItem('blogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);

      updateUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      handleError(exception);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
}

export default Login;
