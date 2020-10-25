// Library dependencies.
const Citizen = require('../models/Citizen')

/**
 * GET /
 * Get all citizens in the database.
 */
exports.get_index = (req, res) => {
  Citizen.find({})
    .then((docs) => {
      res.json({ result: 'success', data: docs })
    })
}

/**
 * POST /update
 * Update a citizen from their id. Basically makes
 * them negative.
 */
exports.post_update = (req, res) => {
  // get required data
  const id = req.body.id

  // check to make sure id exists
  if (!id) {
    return res.status(400).json({ result: 'arg-error' })
  }

  // find the citizen and update their status
  Citizen.findById(id)
    .then((doc) => {
      if (doc) {
        doc.infectionHistory.isCurrentlyPositive = false
        doc.save()
          .then(() => {
            res.json({ result: 'success' })
          }).catch((err) => res.status(500).json({ result: 'db-error', data: err }))
      } else {
        return res.status(400).json({ result: 'no-exist' })
      }
    }).catch((err) => res.status(500).json({ result: 'db-error', data: err }))
}

/**
 * GET /positive
 * Gets a count of registered citizens who
 * are classed as positive.
 */
exports.get_positive = (req, res) => {
  Citizen.find({ isCurrentlyPositive: true }).count()
    .then((count) => {
      res.json({ result: 'success', data: count })
    }).catch((err) => {
      res.status(500).json({ result: 'db-error', data: err })
    })
}

/**
 * GET /negative
 * Gets a count of registered citizens who
 * are no longer classed as positive.
 */
exports.get_negative = (req, res) => {
  Citizen.find({ isCurrentlyPositive: false }).count()
    .then((count) => {
      res.json({ result: 'success', data: count })
    }).catch((err) => {
      res.status(500).json({ result: 'db-error', data: err })
    })
}

/**
 * POST /case
 * Adds a new case to the database who is confirmed positive.
 */
exports.post_case = (req, res) => {
  // get required data
  const { firstName, lastName, county } = req.body

  // ensure data is set
  if (!firstName || !lastName || !county) {
    return res.status(400).json({ result: 'arg-error' })
  }

  // create a new citizen object who is infected
  const citizen = new Citizen({
    firstName: firstName,
    lastName: lastName,
    county: county,
    infectionHistory: {
      positiveDate: new Date(),
      isCurrentlyPositive: true
    }
  })

  // save object to database
  citizen.save()
    .then(() => {
      res.json({ result: 'success' })
    })
}
