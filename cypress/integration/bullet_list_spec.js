/// <reference types="cypress" />

describe('Bullet list', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/index.html');
  });

  it('supports * ul as a markdown shortcut', () => {
    cy.get('#editor').type('* Hello {enter}List');
    cy.get('#editor ul').should('have.length', 1);
    cy.get('#editor li').should('have.length', 2);
  });

  it('terminates the ul on double enter', () => {
    cy.get('#editor').type('* Hello {enter}List{enter}{enter}Goodbye');
    cy.get('#editor ul').should('have.length', 1);
    cy.get('#editor li').should('have.length', 2);
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="bullet_list"]').click();
    cy.get('#editor').type('I like list items');
    cy.get('#editor ul').should('have.length', 1);
    cy.get('#editor li').should('have.length', 1);
  });
});
