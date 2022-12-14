const AddBlog = ({ title, author, url, onChangeTitle, onChangeAuthor, onChangeUrl, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div>
      title: 
      <input type='text' name='title' value={title} onChange={onChangeTitle} />
    </div>
    <div>
      author: 
      <input type='text' name='author' value={author} onChange={onChangeAuthor} />
    </div>
    <div>
      url:
      <input type='text' name='url' value={url} onChange={onChangeUrl} />
    </div>
    <button type='submit'>create</button>
  </form>
)

export default AddBlog
