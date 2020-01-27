/// <reference types="cypress" />

describe('Links', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('marks up links as a tags', () => {
    cy.get('#editor').type('https://futurelearn.com is great');
    cy.get('#editor a').should('have.attr', 'href', 'https://futurelearn.com');
  });

  it('supports links inserted as markdown', () => {
    cy.get('#editor').type('[futurelearn is great](https://futurelearn.com)');

    cy.get('#editor a')
      .should('have.attr', 'href', 'https://futurelearn.com')
      .should('have.text', 'futurelearn is great');
  });
});
