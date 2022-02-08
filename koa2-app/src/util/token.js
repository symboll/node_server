const jwt  = require('jsonwebtoken')

const { security: { 
  expiresIn,
  key
}} = require('../config')

const getToken = (name, avatar, _id) => {
  return jwt.sign({
    name,
    avatar,
    _id
  },key, {
    expiresIn
  })
}

module.exports = getToken