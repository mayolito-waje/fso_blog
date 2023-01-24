import PropTypes from 'prop-types';

function Logout({ onSubmit, user }) {
  return (
    <form onSubmit={onSubmit}>
      <p>
        {user.name} is logged in
        <button type="submit">logout</button>
      </p>
    </form>
  );
}

Logout.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Logout;
