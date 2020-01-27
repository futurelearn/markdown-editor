/// <reference types="cypress" />

describe('Strong', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234')
  });

  ['b', 'B'].forEach(shortcut => {
    it(`supports mod ${shortcut} as a keyboard shortcut`, () => {
      cy.get('#editor')
        .keyboardShortcut(shortcut)
        .type('I like strong text');
      cy.get('#editor strong').should('have.text', 'I like strong text');
      cy.get('input[type="hidden"]').should('have.value', '**I like strong text**');
    });  
  })

  it('supports strong markdown keyboard shortcut', () => {
    cy.get('#editor').type('**I like strong text**');
    cy.get('#editor strong').should('have.text', 'I like strong text');
    cy.get('input[type="hidden"]').should('have.value', '**I like strong text**');
  });

  it('doesn\'t push the cursor to the next line when using markdown', () => {
    cy.get('#editor').type('h{enter}').type('{uparrow}').type('{rightarrow}').type('**bold**').type('something');
    cy.get('#editor p:nth-of-type(2)').should('have.text', '');
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="strong"]').click();
    cy.get('#editor').type('I like strong text');
    cy.get('#editor strong').should('have.text', 'I like strong text');
    cy.get('input[type="hidden"]').should('have.value', '**I like strong text**');
  });
});
