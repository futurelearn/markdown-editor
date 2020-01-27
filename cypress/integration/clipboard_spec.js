/// <reference types="cypress" />

describe('Interacting with the clipboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('supports copy and pasting of plain text', () => {
    cy.get('.ProseMirror').paste('I am a dog');

    cy.get('#editor').should('have.text', 'I am a dog');
  });

  it('supports copy and pasting of markdown', () => {
    cy.get('.ProseMirror').paste('# I am a dog');

    cy.get('#editor h1').should('have.text', 'I am a dog');
  });

  it('supports copy and pasting of html', () => {
    cy.get('.ProseMirror').paste('<h1>I am a dog</h1>', 'text/html');

    cy.get('#editor h1').should('have.text', 'I am a dog');
  });

  it('doesn\'t render images that are pasted in', () => {
    cy.get('.ProseMirror').paste('<img src="https://picsum.photos/200/300" />', 'text/html');
    cy.get('#editor').should('not.contain.html', '<img src="https://picsum.photos/200/300" contenteditable="false" draggable="true">');
    cy.get('body').should('contain.text', 'Pasted content cannot contain images');
  });
});
