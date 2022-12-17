import { useState } from 'react'

const Blog = ({blog, user}) => {
  const [viewFull, setViewFull] = useState(false)

  const display = { display: viewFull ? '' : 'none' }
  const buttonLabel = viewFull ? 'hide' : 'view'

  const toggleView = () => {
    setViewFull(!viewFull)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleView}>{buttonLabel}</button>
      <div style={display}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button>like</button></div>
        <div>{user.name}</div>
      </div>
    </div>  
  )
}

export default Blog