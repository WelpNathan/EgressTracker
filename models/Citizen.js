// Module dependencies.
const mongoose = require('mongoose')

// Define the schema for the database document.
const citizenSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  county: {
    type: String,
    required: true
  },
  infectionHistory: {
    positiveDate: {
      type: Date,
      required: true
    },
    isCurrentlyPositive: {
      type: Boolean,
      required: true
    }
  }
})

// Export the schema as a model.
module.exports = mongoose.model('Citizen', citizenSchema)
