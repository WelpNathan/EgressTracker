// Module dependencies.
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Initialise .env configuration.
require('dotenv').config()

// Library dependencies.
const indexRouter = require('./routes/index')
const mongo = require('./lib/mongo')

// Initialise Express application.
var app = express()

// Initialise Express middleware.
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Initialise MongoDB.
mongo.init()

// Initialise Express routes.
app.use('/', indexRouter)

// Export Express application.
module.exports = app
