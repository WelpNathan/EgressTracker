// Library dependencies.
const Account = require('../models/Account')
const passwordHelper = require('../lib/passwordHelper')
const authHelper = require('../lib/authHelper')

/**
 * GET /
 * Returns every user in the system, poses
 * a massive security vulnerability and is
 * only used for this project.
 */
exports.get_index = (req, res) => {
  Account.find({})
    .then((docs) => {
      res.json({ result: 'success', data: docs })
    })
}

/**
 * POST /account
 * Creates a new account in the system.
 */
exports.post_account = (req, res) => {
// get required data
  const { username, email, password } = req.body

  // ensure all of them are set
  if (!username || !email || !password) {
    return res.status(400).json({ result: 'arg-error' })
  }

  // run user creation checks- basically make sure username and email isn't taken
  Account.isUserCreationAllowed(username, email)
    .then((queryResult) => {
    // return validation/duplication errors to sender
      if (!queryResult.canMake) return res.status(400).json({ result: queryResult.type, type: queryResult.reason })

      // create the user and set the password
      const user = new Account({ username: username, email: email })
      user.setPassword(password)
        .then(() => {
          // save the user model into the system and then
          // return success!
          user.save().then(() => {
            res.json({ result: 'success' })
          }).catch((err) => res.status(500).json({ result: 'db-error', data: err }))
        })
    }).catch((err) => res.status(500).json({ result: 'db-error', data: err }))
}

/**
 * DELETE /deleteAccount
 * Deletes an account from the system by username.
 */
exports.delete_account = (req, res) => {
  // get required data
  const { username } = req.body

  // ensure username is set
  if (!username) {
    return res.status(400).json({ result: 'arg-error' })
  }

  // delete user from username
  Account.deleteOne({ username: username })
    .then((doc) => {
      res.json({ result: 'success', data: { count: doc.deletedCount } })
    }).catch((err) => {
      console.error(err)
      res.status(500).json({ result: 'db-error', data: err })
    })
}

/**
 * POST /login
 * Log the user into the system and then return a JWT.
 */
exports.post_login = (req, res) => {
  // get the username and password from the body
  const { username, password } = req.body

  // ensure username and password were set
  if (!username || !password) {
    return res.status(400).json({ result: 'arg-error' })
  }

  // find a username and compare passwords
  Account.findOne({ username: username }).then((doc) => {
    // check to see if an account was found
    if (!doc) return res.status(401).json({ result: 'account-no-exist' })

    // get password hash and salt from the document
    const passwordHash = doc.password_hash
    const passwordSalt = doc.password_salt

    // check to see if the password they entered matches the
    // one in the database by running PBKDF2.
    passwordHelper.verifyPassword(password, passwordSalt, passwordHash)
      .then((passwordMatches) => {
        if (passwordMatches) {
          // password matches, give them an access token
          const jwt = authHelper.generateAccessToken(username)
          return res.json({ result: 'success', data: { jwt: jwt } })
        } else {
          // password does not match, return error 401 (unauthorised)
          return res.status(401).json({ result: 'password-no-match' })
        }
      })
  }).catch((err) => { res.status(500).json({ result: 'db-error', data: err }) })
}
