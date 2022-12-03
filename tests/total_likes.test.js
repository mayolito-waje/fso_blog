import { totalLikes } from '../utils/list_helper.js';
import { blogs } from './test_helpers.js';

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes([blogs[0]]);
    expect(result).toBe(7);
  });

  test('returns the total likes for multiple blogs', () => {
    const result = totalLikes(blogs);
    expect(result).toBe(36);
  });

  test('if empty blog lists, return 0', () => {
    const result = totalLikes([]);
    expect(result).toBe(0);
  });
});
