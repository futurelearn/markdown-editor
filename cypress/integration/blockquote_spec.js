/// <reference types="cypress" />

describe('Blockquote', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/index.html');
  });

  it('supports the > blockquote markdown keyboard shortcut', () => {
    cy.get('#editor').type('> I like blockquote');
    cy.get('#editor blockquote').should('have.text', 'I like blockquote');
  });

  it('supports multiline blockquotes', () => {
    cy.get('#editor').type('> I like blockquote{enter}I really do');
    cy.get('#editor blockquote').should('have.text', 'I like blockquoteI really do');
  });

  it('exits the blockquote on double enter', () => {
    cy.get('#editor').type('> I like blockquote{enter}{enter}But not that much');
    cy.get('#editor blockquote').should('have.text', 'I like blockquote');
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="blockquote"]').click();
    cy.get('#editor').type('I like quoted text');
    cy.get('#editor blockquote').should('have.text', 'I like quoted text');
  });
});
