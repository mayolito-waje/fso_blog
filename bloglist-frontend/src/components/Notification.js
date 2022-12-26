import { isNull } from 'lodash';
import PropTypes from 'prop-types';

function Notification({ message, isError }) {
  if (isNull(message)) {
    return;
  }

  const color = isError === true ? 'red' : 'green';

  const style = {
    fontSize: 25,
    color,
    borderRadius: 5,
    border: `solid ${color} 2px`,
    textAlign: 'center',
    padding: 10,
    margin: 10,
  };

  return (
    <div id="notification" style={style}>
      {message}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool,
};

Notification.defaultProps = {
  message: null,
  isError: false,
};

export default Notification;
