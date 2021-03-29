const jwt  = require('jsonwebtoken')

const { security: { 
  expiresIn,
  key
}} = require('../config')

const getToken = (name, role) => {
  return jwt.sign({
    name,
    role
  },key, {
    expiresIn
  })
}

module.exports = getToken