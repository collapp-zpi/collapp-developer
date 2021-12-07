// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  const username = Cypress.env('USER_NAME')
  const password = Cypress.env('USER_PWD')
  const loginUrl = 'http://localhost:3001/api/auth/signin'
  const cookieName = 'next-auth.session-token'

  const socialLoginOptions = {
    username,
    password,
    loginUrl,
    args: ['--no-sandbox'],
    usernameField: '#username',
    passwordField: '#password',
    passwordSubmitBtn: 'button[name="action"]',
    headless: true,
    logs: false,
    loginSelector: 'button[type="submit"]',
    postLoginSelector: '[data-test="logged-profile"]',
  }

  return cy.task('Auth0Login', socialLoginOptions).then(({ cookies }) => {
    cy.clearCookies()

    const cookie = cookies.filter((cookie) => cookie.name === cookieName).pop()
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
    }
  })
})
