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

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'user', password: 'testUser#00' });
    });

    it('A blog can be created', () => {
      cy.get('.togglable').contains('new blog').click();
      cy.get('#create-blog input[name="title"]').type('title');
      cy.get('#create-blog input[name="author"]').type('author');
      cy.get('#create-blog input[name="url"]').type('url');
      cy.get('#create-blog > button[type="submit"]').click();

      cy.contains('a new blog title by author added');
      cy.isSuccessMessage();
      cy.get('.blog .overview').contains('title author');

      cy.get('.blog .overview').contains('title author').parent().as('createdBlog');
      cy.get('@createdBlog').find('.url').should('contain', 'url');
      cy.get('@createdBlog').find('.likes').should('contain', 'likes 0');
      cy.get('@createdBlog').find('.user').should('contain', 'test user');
    });

    describe('when blogs are created', () => {
      beforeEach(() => {});
    });
  });
});
