/// <reference types="cypress" />

describe('Code block', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  ['```', '~~~'].forEach(shortcut => {
    it(`supports code blocks with ${shortcut} markdown shortcut`, () => {
      cy.get('#editor').type(shortcut);
      cy.get('code').should('have.length', 1);
      cy.get('#editor').type('var name = "sam";');
      cy.get('.hljs-keyword').should('have.text', 'var');
      cy.get('.hljs-string').should('have.text', '"sam"');
      cy.get('input[type="hidden"]').should(
        'have.value',
        '~~~javascript\nvar name = "sam";\n~~~'
      );
    });
  });

  it('removes the code block when there is no content', () => {
    cy.get('#editor').type('```');
    cy.get('#editor').type('Hello');
    cy.get('#editor').type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}'
    );
    cy.get('code').should('have.length', 0);
    cy.get('input[type="hidden"]').should('have.value', '');
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="code_block"]').click();
    cy.get('#editor').type('var code = "I love";');
    cy.get('code').should('have.text', 'var code = "I love";');
    cy.get('input[type="hidden"]').should(
      'have.value',
      '~~~javascript\nvar code = "I love";\n~~~'
    );
    cy.get('button[data-item="code_block"]').click();
    cy.get('code').should('have.text', 'var code = "I love";');
  });

  it('shows contextual help when in a code block', () => {
    cy.get('#editor').type('```');
    cy.get('#editor').type('Hello');
    cy.get('body').should(
      'contain.text',
      'Hold down shift and press enter to exit the code block'
    );
  });

  it('supports multiple code blocks of different languages', () => {
    cy.get('#editor')
      .type('```')
      .type('var name = "code";')
      .type('{shift}{enter}')
      .type('```')
      .type('def name:{enter}    code');
    cy.get('input[type="hidden"]').should(
      'have.value',
      '~~~javascript\nvar name = "code";\n~~~\n\n~~~python\ndef name:\n    code\n~~~'
    );
  });
});
