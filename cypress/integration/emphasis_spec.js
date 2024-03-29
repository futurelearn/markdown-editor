/// <reference types="cypress" />

describe('Emphasis', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/index.html');
  });

  ['i', 'I'].forEach(shortcut => {
    it(`supports mod ${shortcut} keyboard shortcut`, () => {
      cy.get('#editor')
        .keyboardShortcut(shortcut)
        .type('I like italic text');
      cy.get('#editor em').should('have.text', 'I like italic text');
    });
  });

  ['*', '_'].forEach(symbol => {
    it(`supports the ${symbol} italic markdown keyboard shortcut`, () => {
      cy.get('#editor').type(`${symbol}I like italic text${symbol}`);
      cy.get('#editor em').should('have.text', 'I like italic text');
    });
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="em"]').click();
    cy.get('#editor').type('I like italic text');
    cy.get('#editor em').should('have.text', 'I like italic text');
  });

  it('should have aria label', () => {
    cy.get('button[data-item="em"]').should('have.attr', 'aria-label', 'Toggle emphasis');
  });
});
