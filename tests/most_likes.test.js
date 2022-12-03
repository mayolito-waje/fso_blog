import { mostLikes } from '../utils/list_helper.js';
import { blogs } from './test_helpers.js';

describe('most likes', () => {
  test('return the blog with most likes', () => {
    const result = mostLikes(blogs);
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    expect(result).toStrictEqual(expectedResult);
  });

  test('return empty object for empty arrays', () => {
    const result = mostLikes([]);
    expect(result).toStrictEqual({});
  });
});
