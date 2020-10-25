// Module dependencies.
const jwt = require('jsonwebtoken')

/**
 * Ensures the bearer token is set.
 */
const getBearer = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401) // 401: unauthorised
  return next(token)
}

/**
 * Express middleware to validate a JSONWebToken.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {Function} next
 */
const authenticateToken = (req, res, next) => {
  getBearer(req, res, (token) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
      if (err) return res.sendStatus(403) // 403: forbidden (no permissions)

      // attach user token to express request object
      req.user = token

      // perform next action
      next()
    })
  })
}

module.exports = authenticateToken
