Cypress.Commands.add('isSuccessMessage', () => {
  cy.get('#notification')
    .should('have.css', 'color', 'rgb(0, 128, 0)')
    .and('have.css', 'border-color', 'rgb(0, 128, 0)');
});

Cypress.Commands.add('isErrorMessage', () => {
  cy.get('#notification')
    .should('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-color', 'rgb(255, 0, 0)');
});

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/users', { name, username, password });
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem('blogAppUser', JSON.stringify(body));
      cy.visit('http://localhost:3000');
    });
});

Cypress.Commands.add('createBlog', ({
  title,
  author,
  url,
  likes,
}) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: {
      title,
      author,
      url,
      likes,
    },
    headers: {
      Authorization: `bearer ${JSON.parse(localStorage.getItem('blogAppUser')).token}`,
    },
  });
  cy.visit('http://localhost:3000');
});
