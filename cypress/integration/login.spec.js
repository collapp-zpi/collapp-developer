describe('login', () => {
  before(() => {
    cy.visit('/')
  })

  it('Login with Auth0', () => {
    const username = Cypress.env('USER_NAME')
    const password = Cypress.env('USER_PWD')
    const loginUrl = Cypress.env('SITE_NAME')
    const cookieName = Cypress.env('COOKIE_NAME')
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      args: ['--no-sandbox'],
      usernameField: '#username',
      passwordField: '#password',
      passwordSubmitBtn: 'button[name="action"]',
      headless: true,
      logs: true,
      loginSelector: 'button[type="submit"]',
      postLoginSelector: '[data-test="logged-profile"]',
    }

    return cy.task('Auth0Login', socialLoginOptions).then(({ cookies }) => {
      cy.clearCookies()

      const cookie = cookies
        .filter((cookie) => cookie.name === cookieName)
        .pop()
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        })

        Cypress.Cookies.defaults({
          preserve: cookieName,
        })

        // remove the two lines below if you need to stay logged in
        // for your remaining tests
        // cy.visit('/api/auth/signout')
        // cy.get('form').submit()
      }
    })
  })
})
