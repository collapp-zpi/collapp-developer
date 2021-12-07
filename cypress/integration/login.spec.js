describe('login', () => {
  before(() => {
    cy.visit('/')
  })

  it('Login with Auth0', () => {
    cy.login()
    cy.visit('/plugins/create')
  })
})
