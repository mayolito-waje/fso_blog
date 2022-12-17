import { useState, useEffect, useRef } from 'react'
import { isNull } from 'lodash'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import AddBlog from './components/AddBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser')

    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const clearNotification = () => 
    setTimeout(() => {
      setMessage(null)
      setIsError(false)
    }, 5000)
  

  const handleError = (exception) => {
    const message = exception.response.data.error
    setMessage(message)
    setIsError(true)
  
    clearNotification()
  }

  const updateUser = (user) => {
    setUser(user)
    setMessage(`Logged in as ${user.name}`)
    clearNotification()
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    const addedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(addedBlog))

    setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
    clearNotification()
  }

  const renderPage = () =>  (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError}/>
      <Logout onSubmit={handleLogout} user={user} />

      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <AddBlog
          createBlog={handleCreateBlog}
          handleError={(exception) => handleError(exception)}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} />
      )}
    </div>
  )

  return (
    <>
      {
        isNull(user)
          ? <>
            <Notification message={message} isError={isError}/>
            <Togglable buttonLabel='login'>
              <Login 
                updateUser={updateUser}
                handleError={(exception) => handleError(exception)}
              />
            </Togglable>
          </>
          : renderPage()
      }
    </>
  )
}

export default App
