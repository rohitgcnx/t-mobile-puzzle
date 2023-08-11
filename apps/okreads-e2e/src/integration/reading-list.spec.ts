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

  it('Then: I should be able to mark the book as finished', () => {
    cy.get('input[type="search"]').type('php');
    cy.get('form').submit();
    cy.get('[data-cy-btnid="1"]').contains('Want to Read').click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('.mark-btn').click();
    cy.get('.reading-list-item--details-finished-info').should('be.visible');
    cy.get('.close-readlist-icon').click();
    cy.get('[data-cy-finish-btnid="1"]').should('be.visible');
  })
});