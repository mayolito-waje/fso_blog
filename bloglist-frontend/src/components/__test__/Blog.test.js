import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Blog from '../Blog';

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 2,
    user: {
      id: '123',
      name: 'user name',
    },
  };

  const loggedUser = {
    id: '123',
  };
  const mockIncreaseLikes = jest.fn();
  const mockRemoveBlog = jest.fn();

  test('display title and author only by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        loggedUser={loggedUser}
        increaseLikes={mockIncreaseLikes}
        removeBlog={mockRemoveBlog}
      />,
    );

    const blogDetails = container.querySelector('.blog');
    const extraDetails = container.querySelector('.extraDetails');

    expect(blogDetails).toHaveTextContent(blog.title);
    expect(blogDetails).toHaveTextContent(blog.author);
    expect(extraDetails).toHaveStyle('display: none');
  });

  test('show the number of likes and url when the view button is clicked and vice versa', async () => {
    const { container } = render(
      <Blog
        blog={blog}
        loggedUser={loggedUser}
        increaseLikes={mockIncreaseLikes}
        removeBlog={mockRemoveBlog}
      />,
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const extraDetails = container.querySelector('.extraDetails');
    expect(extraDetails).not.toHaveStyle('display: none');

    await user.click(viewButton);
    expect(extraDetails).toHaveStyle('display: none');
  });

  test('properly received the increase likes event handler as props', async () => {
    render(
      <Blog
        blog={blog}
        loggedUser={loggedUser}
        increaseLikes={mockIncreaseLikes}
        removeBlog={mockRemoveBlog}
      />,
    );

    const user = userEvent.setup();

    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockIncreaseLikes.mock.calls).toHaveLength(2);
  });
});
