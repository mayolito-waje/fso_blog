export const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

export const favoriteBlog = (blogs) => {
  const result = blogs.length === 0
    ? {}
    : blogs.reduce((topBlog, blog) => {
      if (blog.likes > topBlog.likes) return blog;
      return topBlog;
    });

  return result;
};
