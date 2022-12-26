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
      beforeEach(() => {
        cy.createBlog({
          title: 'title 1', author: 'author 1', url: 'url1', likes: 2,
        });
        cy.createBlog({
          title: 'title 2', author: 'author 2', url: 'url2', likes: 3,
        });
        cy.createBlog({
          title: 'title 3', author: 'author 3', url: 'url3', likes: 0,
        });

        cy.get('.blog .overview').contains('title 2 author 2').parent().as('testBlog');
      });

      it('can like a blog', () => {
        cy.get('@testBlog').find('.view-extra').click();
        cy.get('@testBlog').find('.likes > button').click();
        cy.get('@testBlog').find('.likes').contains('likes 4');
      });

      describe('blog deletion', () => {
        beforeEach(() => {
          cy.get('@testBlog').find('button.remove-blog').as('removeButton');
        });

        it('can delete a blog if the logged user is the owner', () => {
          cy.get('@testBlog').find('.view-extra').click();
          cy.get('@removeButton').should('be.visible');
          cy.get('@removeButton').click();
          cy.get('.blog .overview').contains('title 2 author 2').should('not.exist');
        });

        it('can\'t delete a blog if the logged user is not the owner', () => {
          cy.createUser({
            name: 'another user',
            username: 'anotheruser',
            password: 'testUser#001',
          });
          cy.login({ username: 'anotheruser', password: 'testUser#001' });
          cy.get('@testBlog').find('.view-extra').click();
          cy.get('@removeButton').should('not.be.visible');
        });
      });

      it.only('blogs are listed by likes order (highest likes first in the list)', () => {
        cy.get('.blog').eq(0).find('.overview').should('contain', 'title 2 author 2');
        cy.get('.blog').eq(1).find('.overview').should('contain', 'title 1 author 1');
        cy.get('.blog').eq(2).find('.overview').should('contain', 'title 3 author 3');

        cy.get('.blog .overview').contains('title 1 author 1').parent().as('testBlog');
        cy.get('@testBlog').find('.likes').as('likes');
        cy.get('@testBlog').find('.likes > button').as('likeButton');

        cy.get('@testBlog').find('button.view-extra').click();
        cy.get('@likeButton').click();
        cy.get('@likes').contains('likes 3');
        cy.get('@likeButton').click();
        cy.get('@likes').contains('likes 4');

        cy.get('.blog').eq(0).find('.overview').should('contain', 'title 1 author 1');
      });
    });
  });
});
