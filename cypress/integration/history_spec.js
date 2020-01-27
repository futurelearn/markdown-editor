/// <reference types="cypress" />

describe('History', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('supports redo and undo history', () => {
    cy.get('#editor')
      .type('pigs are smarter than dogs')
      .should('have.text', 'pigs are smarter than dogs');

    cy.get('#editor')
      .keyboardShortcut('z')
      .should('have.text', '');

    cy.get('#editor')
      .keyboardShortcut('y')
      .should('have.text', 'pigs are smarter than dogs');
  });
});
