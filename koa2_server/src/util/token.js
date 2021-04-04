const jwt  = require('jsonwebtoken')

const { security: { 
  expiresIn,
  key
}} = require('../config')

const getToken = (name, _id) => {
  return jwt.sign({
    name,
    _id
  },key, {
    expiresIn
  })
}

module.exports = getToken