/// <reference types="cypress" />

describe('Inline code', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('supports mod ` as a keyboard shortcut', () => {
    cy.get('#editor')
      .type('{meta}`')
      .type('I like code');
    cy.get('#editor code').should('have.text', 'I like code');
  });

  it('supports code markdown keyboard shortcut', () => {
    cy.get('#editor').type('`I like code`');
    cy.get('#editor code').should('have.text', 'I like code');
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="code"]').click();
    cy.get('#editor').type('I like code text');
    cy.get('#editor code').should('have.text', 'I like code text');
  });
});
