import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

const AddBlog = forwardRef(({ createBlog, handleError }, refs) => {
  const emptyBlog = {
    title: '',
    author: '',
    url: '',
  }

  const ref = useRef()

  const [newBlog, setNewBlog] = useState(emptyBlog)

  const addNewBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlog(newBlog)
      setNewBlog(emptyBlog)
    } catch (exception) {
      handleError(exception)
    }
  }

  useImperativeHandle(refs, () => newBlog, [newBlog])

  return (
    <form onSubmit={addNewBlog} ref={ref}>
      <div>
        title: 
        <input type='text' name='title' value={newBlog.title}
        onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} />
      </div>
      <div>
        author: 
        <input type='text' name='author' value={newBlog.author}
        onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} />
      </div>
      <div>
        url:
        <input type='text' name='url' value={newBlog.url}
        onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} />
      </div>
      <button type='submit'>create</button>
    </form>
  )
})

AddBlog.displayName = 'AddBlog'

export default AddBlog
