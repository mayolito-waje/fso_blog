import { useState } from 'react';
import PropTypes from 'prop-types';

function AddBlog({ createBlog, handleError }) {
  const emptyBlog = {
    title: '',
    author: '',
    url: '',
  };

  const [newBlog, setNewBlog] = useState(emptyBlog);

  const addNewBlog = async (event) => {
    event.preventDefault();

    try {
      await createBlog(newBlog);
      setNewBlog(emptyBlog);
    } catch (exception) {
      handleError(exception);
    }
  };

  return (
    <form onSubmit={addNewBlog} id="create-blog">
      <div>
        title:
        <input
          type="text"
          name="title"
          value={newBlog.title}
          data-testid="title-input"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, title: target.value })
          }
        />
      </div>
      <div>
        author:
        <input
          type="text"
          name="author"
          value={newBlog.author}
          data-testid="author-input"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, author: target.value })
          }
        />
      </div>
      <div>
        url:
        <input
          type="text"
          name="url"
          value={newBlog.url}
          data-testid="url-input"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, url: target.value })
          }
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
}

AddBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};

export default AddBlog;
