import { useState, useEffect } from 'react'
import { isNull } from 'lodash'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      const message = exception.response.data.error
      setMessage(message)
      setIsError(true)

      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const renderPage = () =>  (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError}/>
      <Logout onSubmit={handleLogout} user={user} />
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
