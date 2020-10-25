// Module dependencies.
var express = require('express')

// Library dependencies.
const indexController = require('../controllers/indexController')
const authMiddleware = require('../middleware/authMiddleware')
const accounts = require('../routes/accounts')
const cases = require('../routes/cases')

// Express router.
var router = express.Router()

// Initialise routes.
router.get('/', indexController.get_index)
router.use('/accounts', accounts)
router.use('/cases', authMiddleware, cases) // MUST BE AUTHORISED TO USE!

// Export Express router.
module.exports = router
