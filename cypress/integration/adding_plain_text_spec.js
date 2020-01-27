/// <reference types="cypress" />

describe('Adding plain text to the editor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('sets the correct value', () => {
    cy.get('#editor')
      .type('hello world')
      .should('have.text', 'hello world');
    cy.get('input[type="hidden"]').should('have.value', 'hello world');
  });
});
