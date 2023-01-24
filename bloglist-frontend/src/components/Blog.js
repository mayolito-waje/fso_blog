import { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({ blog, loggedUser, increaseLikes, removeBlog }) {
  const [viewFull, setViewFull] = useState(false);

  const display = { display: viewFull ? '' : 'none' };
  const buttonLabel = viewFull ? 'hide' : 'view';
  const removeButtonDisplay = {
    display: blog.user.id === loggedUser.id ? '' : 'none',
  };

  const toggleView = () => {
    setViewFull(!viewFull);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <span className="overview">
        {blog.title} {blog.author}
      </span>
      <button className="view-extra" type="button" onClick={toggleView}>
        {buttonLabel}
      </button>
      <div style={display} className="extraDetails">
        <div className="url">{blog.url}</div>
        <div className="likes">
          likes {blog.likes}
          <button
            type="button"
            data-likes={blog.likes}
            data-id={blog.id}
            onClick={increaseLikes}
          >
            like
          </button>
        </div>
        <div className="user">{blog.user.name}</div>
        <button
          className="remove-blog"
          type="button"
          style={removeButtonDisplay}
          data-id={blog.id}
          data-title={blog.title}
          data-author={blog.author}
          onClick={removeBlog}
        >
          remove
        </button>
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    id: PropTypes.string.isRequired,
  }).isRequired,

  loggedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,

  increaseLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
