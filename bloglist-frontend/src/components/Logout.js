const Logout = ({ onSubmit, user }) => (
  <form onSubmit={onSubmit}>
    <p>
      {user.name} is logged in
    </p>
    <button type='submit'>logout</button>
  </form>
)

export default Logout
