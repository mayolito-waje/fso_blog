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
