/// <reference types="cypress" />

describe('Ordered list', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/index.html');
  });

  it('supports 1. ol as a markdown shortcut', () => {
    cy.get('#editor').type('1. Hello {enter}List');
    cy.get('#editor ol').should('have.length', 1);
    cy.get('#editor li').should('have.length', 2);
  });

  it('terminates the ol on double enter', () => {
    cy.get('#editor').type('1. Hello {enter}List{enter}{enter}Goodbye');
    cy.get('#editor ol').should('have.length', 1);
    cy.get('#editor li').should('have.length', 2);
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="ordered_list"]').click();
    cy.get('#editor').type('I like list items');
    cy.get('#editor ol').should('have.length', 1);
    cy.get('#editor li').should('have.length', 1);
  });
});
