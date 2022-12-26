describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'test user',
      username: 'user',
      password: 'testUser#00',
    };
    cy.createUser(user);
    cy.visit('http://localhost:3000');
  });

  it('Login is shown', () => {
    cy.contains('log in to application').should('be.visible');
    cy.get('#username-field').should('be.visible');
    cy.get('#password-field').should('be.visible');
    cy.get('#login-form > button').should('be.visible');
    cy.get('.togglable button.cancel').should('be.visible');
  });

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username-field > input').type('user');
      cy.get('#password-field > input').type('testUser#00');
      cy.get('#login-form > button').click();

      cy.get('#notification').contains('Logged in as test user');
      cy.isSuccessMessage();
    });

    it('fails with wrong credentials', () => {
      cy.get('#username-field > input').type('user');
      cy.get('#password-field > input').type('wrongpassword');
      cy.get('#login-form > button').click();

      cy.get('#notification').contains('invalid username or password');
      cy.isErrorMessage();
    });
  });
});
