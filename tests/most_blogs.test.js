import { mostBlogs } from '../utils/list_helper.js';
import { blogs } from './test_helpers.js';

describe('most blogs', () => {
  test('return author with largest amount of blogs', () => {
    const result = mostBlogs(blogs);
    const expectedResult = {
      author: 'Robert C. Martin',
      blogs: 3,
    };

    expect(result).toStrictEqual(expectedResult);
  });

  test('return empty object if array is empty', () => {
    const result = mostBlogs([]);
    expect(result).toStrictEqual({});
  });
});
