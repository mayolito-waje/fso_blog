import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import AddBlog from '../AddBlog';

describe('<AddBlog />', () => {
  test('ensure that the event handler for blog creation has a right parameter', async () => {
    const mockCreateBlog = jest.fn();
    const mockHandleError = jest.fn();

    render(
      <AddBlog createBlog={mockCreateBlog} handleError={mockHandleError} />,
    );

    const titleInput = screen.getByTestId('title-input');
    const authorInput = screen.getByTestId('author-input');
    const urlInput = screen.getByTestId('url-input');

    const user = userEvent.setup();

    await user.type(titleInput, 'test title');
    await user.type(authorInput, 'test author');
    await user.type(urlInput, 'test url');

    const createButton = screen.getByRole('button');
    await user.click(createButton);

    const createdBlog = mockCreateBlog.mock.calls[0][0];

    expect(createdBlog.title).toBe('test title');
    expect(createdBlog.author).toBe('test author');
    expect(createdBlog.url).toBe('test url');
  });
});
