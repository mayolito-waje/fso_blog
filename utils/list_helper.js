import _ from 'lodash';

export const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

export const favoriteBlog = (blogs) => {
  const result =
    blogs.length === 0
      ? {}
      : blogs.reduce((topBlog, blog) => {
          if (blog.likes > topBlog.likes) return blog;
          return topBlog;
        });

  return result;
};

export const mostBlogs = (blogs) => {
  const blogsByAuthor = _.reduce(
    blogs,
    (list, blog) => {
      let authorInList = false;
      const { author: checkAuthor } = blog;

      const returnList = _.map(list, ({ author, blogs: blogCount }) => {
        const returnObj = { author, blogs: blogCount };
        if (author === checkAuthor) {
          authorInList = true;
          returnObj.blogs += 1;
        }
        return returnObj;
      });

      if (!authorInList) {
        returnList.push({ author: checkAuthor, blogs: 1 });
      }

      return returnList;
    },
    [],
  );

  return blogsByAuthor.length > 0 ? _.maxBy(blogsByAuthor, (l) => l.blogs) : {};
};

export const mostLikes = (blogs) => {
  const likesByAuthor = _.reduce(
    blogs,
    (list, blog) => {
      let authorInList = false;
      const { author: checkAuthor, likes: checkLikes } = blog;

      const returnList = _.map(list, ({ author, likes }) => {
        const returnObj = { author, likes };
        if (author === checkAuthor) {
          authorInList = true;
          returnObj.likes += checkLikes;
        }
        return returnObj;
      });

      if (!authorInList) {
        returnList.push({ author: checkAuthor, likes: checkLikes });
      }

      return returnList;
    },
    [],
  );

  return likesByAuthor.length > 0 ? _.maxBy(likesByAuthor, (l) => l.likes) : {};
};
