# Save Blogs

A simple project to practice MERN stack and basic CRUD stuffs. Save your favorite blogs to the MongoDB database. It uses React's state management system to handle data and save it to the ui after fetching it from the backend.

## Usage
<ol>
  <li>Clone the repo</li>
  <li>Use <code>pnpm install</code> on both the root directory and client directory to install the required dependencies</li>
  <li>Use <code>.env.example</code> references to setup environment variables on <code>.env</code> file</li>
  <li>Go to root directory and run <code>pnpm dev</code></li>
  <li>After the server and mongodb is running, go to http://localhost:3003</li>
  <li>The app is additionaly hosted at https://fso-blog-list.onrender.com/</li>
</ol>

## Testing

Both the frontend and the backend are tested. The backend's API endpoints are tested with integration testing and mock databases to ensure the API endpoints doesn't have errors. The frontend uses component testing to test some crucial components and redux reducers are also tested.

`cypress` is used to test both the frontend and backend to ensure the application as a whole works fine. The cypress folder is in the bloglist-frontend directory.

## API Endpoints

| **API Endpoints**       | **Usage**                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/users`        | Get all the available registered users in the database                                                                                                         |
| `POST /api/users`       | This handles the registration of new user. Password validity is tested with the regular expression: `/^(?=.*[A-Z])(?=.*[@$!%*#?&])(?=.*[a-z])(?=.*\d).{8,}$/g` |
| `POST /login`           | Handle the login functionality. It uses `jsonwebtoken` to handle the comparison of password hashes                                                             |
| `GET /api/blogs`        | Get the all the available blogs in the database.                                                                                                               |
| `POST /api/blogs`       | Add new blog to the database                                                                                                                                   |
| `PATCH /api/blogs/:id`  | Make a minor update to the blog based on given blog id                                                                                                         |
| `DELETE /api/blogs/:id` | Delete a blog based on id                                                                                                                                      |
