// Module dependencies.
const express = require('express')

// Library dependencies.
const accountController = require('../controllers/accountController')

// Express router.
var router = express.Router()

// Initialise routes.
router.get('/', accountController.get_index)
router.post('/account', accountController.post_account)
router.delete('/account', accountController.delete_account)
router.post('/login', accountController.post_login)

// Export Express router.
module.exports = router
