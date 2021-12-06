const { CustomizedLogin } = require('cypress-social-logins').plugins

module.exports = (on) => {
  on('task', {
    Auth0Login: (options) => CustomizedLogin(options),
  })
}
