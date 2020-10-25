// Module dependencies.
const mongoose = require('mongoose')

/**
 * Initialise the connection to MongoDB.
 */
const init = () => {
  const mongoUsername = process.env.MONGO_USERNAME
  const mongoPassword = process.env.MONGO_PASSWORD
  const mongoAddress = process.env.MONGO_ADDRESS

  // ensure environment variables have been set and then
  // connect using mongoose.
  if (mongoUsername && mongoPassword && mongoAddress) {
    mongoose.connect('mongodb://' + mongoUsername + ':' + mongoPassword + '@' + mongoAddress, { useNewUrlParser: true, useUnifiedTopology: true })
    setupEvents(mongoose.connection)
  } else {
    console.log('Unable to connect to MongoDB as environment variables are not set.')
  }
}

/**
 * Initialises the events for the MongoDB including connection
 * and any errors.
 * @param {MongooseConnection} connection - Database connection
 */
const setupEvents = (connection) => {
  connection.on('error', console.error.bind(console, 'connection error:'))
  connection.once('open', function () {
    console.log('Successfully connected to the MongoDB.')
  })
}

module.exports = {
  init: init
}
