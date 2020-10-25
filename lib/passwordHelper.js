// Module dependencies.
const crypto = require('crypto')

// Set the encryption options.
const encryptionOptions = {
  iterations: 100000,
  hashBytes: 64,
  saltBytes: 32,
  digest: 'sha512'
}

/**
 * Converts a plain text password into a secure PBKDF2 string.
 *
 * Steps to do:
 *  - create a random salt
 *  - use the random salt in the pbkdf2 algorithm
 *  - return the salt created and generated derived key in hex format
 *
 * @param {String} password - password to convert into SHA-256
 * @returns {String} converted password
 */
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    // generate a random salt
    crypto.randomBytes(encryptionOptions.saltBytes, (err, salt) => {
      if (err) reject(err)

      // generate the derived key using the salt
      crypto.pbkdf2(password, salt, encryptionOptions.iterations, encryptionOptions.hashBytes, encryptionOptions.digest, (err, derivedKey) => {
        if (err) reject(err)

        // create response object
        const response = {
          derivedKey: derivedKey.toString('hex'),
          salt: salt.toString('hex')
        }

        resolve(response)
      })
    })
  })
}

/**
 * Checks to see if the plain text password matches with the
 * derived key.
 *
 * Steps to do:
 *  - convert plain text password into pbkdf2 using same salt in the users account
 *  - convert the derived key generated into hex format
 *  - compare the hex to the one in the database
 *  - return the result of the compare
 *
 * @param {String} plainTextPassword - plain text password
 * @param {String} salt - salt used to encrypt password
 * @param {String} originalKey - derivedKey in hex format
 */
const verifyPassword = (plainTextPassword, salt, originalKey) => {
  return new Promise((resolve, reject) => {
    // convert hex value to Node buffer.
    // eslint-disable-next-line new-cap
    const saltBuffer = new Buffer.from(salt, 'hex')

    // generate the derived key using the salt
    crypto.pbkdf2(plainTextPassword, saltBuffer, encryptionOptions.iterations, encryptionOptions.hashBytes, encryptionOptions.digest, (err, derivedKey) => {
      if (err) reject(err)

      // convert the result into hex
      const newKey = derivedKey.toString('hex')

      // compare if the original key is equal to the new key in hex format
      resolve(originalKey === newKey)
    })
  })
}

module.exports = {
  hashPassword: hashPassword,
  verifyPassword: verifyPassword
}
