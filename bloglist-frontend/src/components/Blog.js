import { useState } from 'react'

const Blog = ({blog, increaseLikes, removeBlog}) => {
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
        <div>likes {blog.likes}<button data-likes={blog.likes} data-id={blog.id} onClick={increaseLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <button data-id={blog.id} data-title={blog.title} data-author={blog.author} onClick={removeBlog}>remove</button>
      </div>
    </div>  
  )
}

export default Blog