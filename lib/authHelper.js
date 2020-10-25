// Module dependencies.
const jwt = require('jsonwebtoken')

/**
 * Create an access token to allow deeper access into the API.
 * @param {*} username
 */
const generateAccessToken = (username) => {
  const payload = {
    iss: 'welpnathan.com',
    sub: username,
    aud: 'http://welpnathan.com',
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // expire in 60 mins
    data: {
      username: username
    }
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = {
  generateAccessToken: generateAccessToken
}
