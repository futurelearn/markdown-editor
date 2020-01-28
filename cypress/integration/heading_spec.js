/// <reference types="cypress" />

describe('Heading', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/index.html');
  });

  [
    { shortcut: '#', el: 'h1' },
    { shortcut: '##', el: 'h2' },
    { shortcut: '###', el: 'h3' },
    { shortcut: '####', el: 'h4' },
    { shortcut: '#####', el: 'h5' },
    { shortcut: '######', el: 'h6' },
  ].forEach(({ shortcut, el }) => {
    it(`supports ${el} heading as a markdown shortcut`, () => {
      cy.get('#editor').type(`${shortcut} I like a heading`);
      cy.get(`#editor ${el}`).should('have.text', 'I like a heading');
    });
  });

  it("doesn't do headings over multiple lines", () => {
    cy.get('#editor').type('# Hello heading{enter}Goodbye heading');
    cy.get('#editor h1').should('have.text', 'Hello heading');
  });

  it('can be toggled on and off via the toolbar', () => {
    cy.get('button[data-item="heading"]').click();
    cy.get('#editor').type('I like heading text');
    cy.get('#editor h1').should('have.text', 'I like heading text');
  });
});
