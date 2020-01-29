/// <reference types="cypress" />

describe('Disabling features', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/disabled.html');
  });

  [
    {
      name: 'heading',
      tag: 'h1',
      text: '# Not a heading',
    },
    {
      name: 'blockquote',
      tag: 'blockquote',
      text: '> Not a blockquote',
    },
    {
      name: 'code_block',
      tag: 'pre',
      text: '```Not code',
    },
    {
      name: 'bullet_list',
      tag: 'ul',
      text: '* Not a list item',
    },
    {
      name: 'ordered_list',
      tag: 'ol',
      text: '1. Not a list item',
    },
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

  it('disables links', () => {
    cy.get('#editor').type('http://nolongeralink.com');
    cy.get('#editor a').should('not.exist');
    cy.get('#editor .ProseMirror').paste('[link](http://nolongeralink.com)');
    cy.get('#editor a').should('not.exist');
  });
});
