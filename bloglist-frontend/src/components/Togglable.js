import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(props.show);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }));

  return (
    <div className="togglable">
      <div style={hideWhenVisible}>
        <button
          type="button"
          onClick={toggleVisibility}
          className="button-label"
        >
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={toggleVisibility} className="cancel">
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Togglable.defaultProps = {
  show: false,
};

export default Togglable;
