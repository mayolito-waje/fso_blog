const Login = ({ onSubmit, username, password, onChangeUsername, onChangePassword }) => (
  <form onSubmit={onSubmit}>
    <h2>log in to application</h2>
    <div>
      username
      <input type='text' value={username} name='username' onChange={onChangeUsername} />
    </div>
    <div>
      password
      <input type='password' value={password} name='password' onChange={onChangePassword} />
    </div>
    <button type='submit'>login</button>
  </form>
)

export default Login
