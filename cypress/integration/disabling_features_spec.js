/// <reference types="cypress" />

describe('Disabling features', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('disables marks that are specified as disabled', () => {
    cy.get('#editorWithDisabled [data-icon="code"]').should('not.exist');
    cy.get('#editorWithDisabled')
      .type('`not code`')
      .get('code')
      .should('not.exist');
    cy.get('#editorWithDisabled .ProseMirror')
      .paste('`still not code`')
      .get('code')
      .should('not.exist');
  });

  it.only('disables nodes that are specified as disabled', () => {
    cy.get('#editorWithDisabled [data-icon="heading"]').should('not.exist');
    cy.get('#editorWithDisabled')
      .type('# Not heading')
      .get('h1')
      .should('not.exist');
    cy.get('#editorWithDisabled .ProseMirror')
      .paste('# Still not heading')
      .get('h1')
      .should('not.exist');
  });
});
