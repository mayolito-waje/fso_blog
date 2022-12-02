import { favoriteBlog } from '../utils/list_helper.js';
import blogs from './blogs_seed.js';

describe('favorite blog', () => {
  test('return blog with most likes', () => {
    const favorite = favoriteBlog(blogs);
    expect(favorite).toBe(blogs[2]);
  });

  test('return empty object for empty blog list', () => {
    const checkEmpty = favoriteBlog([]);
    expect(checkEmpty).toStrictEqual({});
  });
});
