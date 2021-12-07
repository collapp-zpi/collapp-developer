describe('draft', () => {
  before(() => {
    cy.login()
    cy.visit('/')
  })

  afterEach(() => {
    cy.wait(1500)
  })

  it('Navigate to draft list', () => {
    cy.contains('Plugins').click()
    cy.url().should('include', '/plugins')
  })

  it('Navigate to draft create form', () => {
    cy.contains('Add').click()
    cy.url().should('include', '/plugins/create')
  })

  it('Empty form is disabled', () => {
    cy.contains('Submit').should('be.disabled')
  })

  it('Fill name input', () => {
    const value = 'Name'
    cy.get('[name="name"]').clear().type(value).should('have.value', value)
  })

  it('Fill description input', () => {
    const value = 'Description text goes here'
    cy.get('[name="description"]')
      .clear()
      .type(value)
      .should('have.value', value)
  })

  it('Submit the form', () => {
    cy.get('button[type="submit"]').click()
    cy.intercept('POST', '/plugins')
  })

  it('Has been redirected', () => {
    cy.url().should('include', '/plugins/')
  })

  it('Open the delete modal', () => {
    cy.get('button').contains('Delete').click()

    cy.get('div.fixed.z-50')
      .find('button')
      .contains('Delete')
      .should('be.disabled')
  })

  it('Fill out delete modal information', () => {
    const value = 'name'
    cy.get('div.fixed.z-50')
      .find('input')
      .clear()
      .type(value)
      .should('have.value', value)
  })

  it('Confirm the delete action', () => {
    cy.get('div.fixed.z-50')
      .find('button')
      .contains('Delete')
      .should('be.enabled')
      .click()
  })
})
