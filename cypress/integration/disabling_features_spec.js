/// <reference types="cypress" />

describe('Disabling features', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/disabled.html');
  });

  [
    {
      name: 'code',
      tag: 'code',
      text: '`I am not code`',
    },
  ].forEach(({ name, tag, text }) => {
    it(`disables ${name} if specified as disabled`, () => {
      cy.get(`[data-item="${name}"]`).should('not.exist');
      cy.get('#editor')
        .type(text)
        .get(tag)
        .should('not.exist');
      cy.get('#editor .ProseMirror')
        .paste(text)
        .get(tag)
        .should('not.exist');
    });
  });
});
