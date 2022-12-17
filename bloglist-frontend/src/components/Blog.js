import { useState } from 'react'

const Blog = ({blog, increaseLikes}) => {
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
        <div>likes {blog.likes}<button data-likes={blog.likes} id={blog.id} onClick={increaseLikes}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>  
  )
}

export default Blog