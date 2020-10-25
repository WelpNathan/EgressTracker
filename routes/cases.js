// Module dependencies.
var express = require('express')

// Library dependencies.
const casesController = require('../controllers/casesController')

// Express router.
var router = express.Router()

// Initialise routes.
router.get('/', casesController.get_index)
router.get('/positive', casesController.get_positive)
router.get('/negative', casesController.get_negative)
router.post('/', casesController.post_case)
router.post('/update', casesController.post_update)

// Export Express router.
module.exports = router
