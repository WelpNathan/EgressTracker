// Module dependencies.
const mongoose = require('mongoose')

// Library dependencies.
const passwordHelper = require('../lib/passwordHelper')

/**
 * Function runs a REGEX check on the string to ensure it follows
 * a valid email pattern.
 *
 * REGEX: https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
 * @param {String} email - email address to validate
 */
const validateEmail = (email) => {
  const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return reg.test(email)
}

/**
 * Checks to ensure the username is within a specific length and doesn't
 * include any weird characters.
 *
 * Rules for username:
 *  - Usernames can consist of lowercase and capitals (capitals get reduced to lowercase later anyway)
 *  - Usernames can consist of alphanumeric characters
 *  - Usernames can consist of underscore and hyphens and spaces
 *  - Cannot be two underscores, two hypens or two spaces in a row
 *  - Cannot have a underscore, hypen or space at the start or end
 *
 * REGEX: https://stackoverflow.com/questions/1221985/how-to-validate-a-user-name-with-regex
 * @param {String} username - username to check
 */
const validateUsername = (username) => {
  const reg = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
  return reg.test(username)
}

// Define the schema for the database document.
const accountSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateEmail, 'Enter a valid email address.']
  },
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateUsername, 'Enter a valid username.']
  },
  password_hash: {
    type: String,
    required: true
  },
  password_salt: {
    type: String,
    required: true
  }
})

/**
 * Sets the password_hash and password_salt.
 * WARNING: Does not save the model!
 *
 * @param {String} plainTextPassword - password
 */
accountSchema.methods.setPassword = function (plainTextPassword) {
  return new Promise((resolve, reject) => {
    passwordHelper.hashPassword(plainTextPassword)
      .then((res) => {
        this.password_hash = res.derivedKey
        this.password_salt = res.salt
        resolve()
      }).catch(reject)
  })
}

/**
 * Mongoose static method to check if a user can create
 * an account with the username and email provided.
 *
 * @param {String} username - username of account
 * @param {Strings} email - email of account
 * @returns {Object} - can create account?
 */
accountSchema.statics.isUserCreationAllowed = function (username, email) {
  return new Promise((resolve, reject) => {
    // run validation checks on username and email
    if (!validateUsername(username)) return resolve({ canMake: false, type: 'validation', reason: 'username' })
    if (!validateEmail(email)) return resolve({ canMake: false, type: 'validation', reason: 'email' })

    // ensure that the username and email does not exist
    this.findOne({ username: username })
      .then((doc) => {
        // if there's an account with the username
        if (doc) return resolve({ canMake: false, type: 'db-duplication', reason: 'username' })

        this.findOne({ email: email })
          .then((doc) => {
            // if there's an account with the email
            if (doc) return resolve({ canMake: false, type: 'db-duplication', reason: 'email' })

            // there are no accounts with the username or email
            return resolve({ canMake: true })
          }).catch((err) => reject(err))
      }).catch((err) => reject(err))
  })
}

// Export the schema as a model.
module.exports = mongoose.model('Account', accountSchema)
