import { useState, useEffect } from 'react'
import { isNull } from 'lodash'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import AddBlog from './components/AddBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const emptyBlog = {
    title: '',
    author: '',
    url: '',
  }

  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [newBlog, setNewBlog] = useState(emptyBlog)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [newBlog])

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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      
      setUser(user)
      setUsername('')
      setPassword('')

      setMessage(`successfully logged in as ${user.name}`)
      clearNotification()
    } catch (exception) {
      handleError(exception)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const addedBlog = await blogService.create(newBlog)

      setNewBlog(emptyBlog)
      setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
      clearNotification()
    } catch (exception) {
      handleError(exception)
    }
  }

  const renderPage = () =>  (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError}/>
      <Logout onSubmit={handleLogout} user={user} />

      <AddBlog
        title={newBlog.title}
        onChangeTitle={({ target }) => setNewBlog({ ...newBlog, title: target.value, })}

        author={newBlog.author}
        onChangeAuthor={({ target }) => setNewBlog({ ...newBlog, author: target.value })}

        url={newBlog.url}
        onChangeUrl={({ target }) => setNewBlog({ ...newBlog, url: target.value })}

        onSubmit={addBlog}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <>
      {
        isNull(user)
          ? <>
            <Notification message={message} isError={isError}/>
            <Login 
              onSubmit={handleLogin}
              username={username}
              password={password}
              onChangeUsername={({ target }) => setUsername(target.value)}
              onChangePassword={({ target }) => setPassword(target.value)}
            />
          </>
          : renderPage()
      }
    </>
  )
}

export default App
