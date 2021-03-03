/// <reference types="cypress" />

describe('When the editor is not editable', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/not_editable.html');
  });

  it('does not display the toolbar', () => {
    cy.get('#editor').should('exist');
    cy.get('#toolbar').should('not.exist');
  });

  it('does not allow anything to be entered by the user', () => {
    cy.get(`#editor [contenteditable=false]`).should('exist');
  });

  it('does not show contextual help when rendering a code block', () => {
    cy.get('#editor').click();
    cy.get('#editor').click();
    cy.get('#editor').click();

    cy.get('body').should(
      'not.contain.text',
      'Hold down shift and press enter to exit the code block'
    );
  });
});
