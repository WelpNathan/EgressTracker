// Module dependencies.
var crypto = require('crypto')

/**
 * GET /
 * Send common values to the endpoint.
 */
exports.get_index = (req, res) => {
  res.json({
    name: 'CoronavirusTracker',
    version: '0.0.0',
    randomSecret: crypto.randomBytes(64).toString('hex')
  })
}
