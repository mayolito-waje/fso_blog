/* eslint-disable react/jsx-indent */
import { useState, useEffect, useRef } from 'react';
import { isNull } from 'lodash';
import Blog from './components/Blog';
import Login from './components/Login';
import Logout from './components/Logout';
import AddBlog from './components/AddBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser');

    if (userJSON) {
      const loggedUser = JSON.parse(userJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const fetchAndSortBlogs = async () => {
    const fetchedBlogs = await blogService.getAll();
    fetchedBlogs.sort((blog1, blog2) => blog2.likes - blog1.likes);
    setBlogs(fetchedBlogs);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchAndSortBlogs();
      } catch {
        window.localStorage.removeItem('blogAppUser');
        setUser(null);
        setMessage('Session expired. Please re-login');
        setIsError(true);

        setTimeout(() => {
          setMessage(null);
          setIsError(false);
        }, 5000);
      }
    })();
  }, [user]);

  const clearNotification = () => setTimeout(() => {
    setMessage(null);
    setIsError(false);
  }, 5000);

  const handleError = (exception) => {
    const errorMessage = exception.response.data.error;
    setMessage(errorMessage);
    setIsError(true);

    clearNotification();
  };

  const updateUser = (loggedUser) => {
    setUser(loggedUser);
    setMessage(`Logged in as ${loggedUser.name}`);
    clearNotification();
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('blogAppUser');
    setUser(null);
  };

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    const addedBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(addedBlog));

    setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`);
    clearNotification();
  };

  const handleIncreaseLikes = async (event) => {
    const { id } = event.target.dataset;
    const { likes } = event.target.dataset;

    const update = { likes: Number(likes) + 1 };
    await blogService.update(id, update);

    fetchAndSortBlogs();
  };

  const handleRemoveBlog = async (event) => {
    const { id, title, author } = event.target.dataset;

    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      await blogService.removeBLog(id);
      fetchAndSortBlogs();
    }
  };

  const renderPage = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />
      <Logout onSubmit={handleLogout} user={user} />

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <AddBlog
          createBlog={handleCreateBlog}
          handleError={(exception) => handleError(exception)}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          loggedUser={user}
          increaseLikes={handleIncreaseLikes}
          removeBlog={handleRemoveBlog}
        />
      ))}
    </div>
  );

  return (
    <div>
      {
        isNull(user)
          ? (
            <>
              <Notification message={message} isError={isError} />
              <Togglable buttonLabel="login">
                <Login
                  updateUser={updateUser}
                  handleError={(exception) => handleError(exception)}
                />
              </Togglable>
            </>
          )
          : renderPage()
      }
    </div>
  );
}

export default App;
