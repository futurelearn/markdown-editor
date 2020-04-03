/// <reference types="cypress" />

describe('Image', () => {
  const fileName = 'image.jpg';
  describe('Uploading images', () => {
    beforeEach(() => {
      cy.server({ delay: 100 });
      cy.visit('http://localhost:1234/index.html');
      cy.fixture('imageUpload').as('imageJSON');
      cy.route('POST', '/images', '@imageJSON').as('postImage');
    });

    it('supports drag and dropping of images', () => {
      cy.fixture(fileName).then(fileContent => {
        cy.get('.ProseMirror').upload(
          { fileContent, fileName, mimeType: 'image/jpg' },
          { subjectType: 'drag-n-drop' }
        );
      });

      cy.get('#editor .image__placeholder').should('have.length', 1);

      cy.wait('@postImage').then(() => {
        cy.get('#editor img').should(
          'have.attr',
          'src',
          'https://picsum.photos/200/300'
        );
        cy.get('#editor .image__placeholder').should('have.length', 0);
      });
    });

    it('supports uploading via the file input', () => {
      cy.get('.ProseMirror');

      cy.fixture(fileName).then(fileContent => {
        cy.get('input[type="file"]').upload({
          fileContent,
          fileName,
          mimeType: 'image/jpg',
        });
      });

      cy.get('#editor .image__placeholder').should('have.length', 1);

      cy.wait('@postImage').then(() => {
        cy.get('#editor img').should(
          'have.attr',
          'src',
          'https://picsum.photos/200/300'
        );
        cy.get('#editor .image__placeholder').should('have.length', 0);
      });
    });

    it('shows an error message if the image fails to upload', () => {
      cy.route({
        method: 'POST',
        url: '/images',
        status: 500,
        response: { errors: 'Something went wrong ' },
      }).as('postImage');

      cy.get('.ProseMirror');

      cy.fixture(fileName).then(fileContent => {
        cy.get('input[type="file"]').upload({
          fileContent,
          fileName,
          mimeType: 'image/jpg',
        });
      });

      cy.wait('@postImage').then(() => {
        cy.get('body').should('contain.text', 'Something went wrong');
        cy.get('#editor placeholder').should('not.exist');
      });
    });
  });

  it('supports images that are part of the initial value', () => {
    cy.visit('http://localhost:1234/prefilled.html');
    cy.get('#editor img').should('exist');
  });
});
