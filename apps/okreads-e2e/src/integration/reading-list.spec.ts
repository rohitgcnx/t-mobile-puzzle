describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to undo the add book from reading list', () => {
    cy.get('input[type="search"]').type('php');

    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-btn-id="1"]').click();
    cy.get('.mat-snack-bar-container').should('be.visible');
    cy.get('.mat-simple-snackbar-action .mat-button').click();
    cy.get('[data-btn-id="1"]').should('not.be.disabled');
  });

  it('Then: I should be able to undo the remove book from reading list', () => {
    cy.get('input[type="search"]').type('php');

    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-btn-id="1"]').click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-cy-btnIdx="0"]').click();
    cy.get('.mat-snack-bar-container').should('be.visible');
    cy.get('.mat-simple-snackbar-action .mat-button').click();
    cy.get('[data-btn-id="1"]').should('be.disabled');
  });
});