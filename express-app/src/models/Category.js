const mongoose = require('mongoose')

const { Schema, model } = mongoose

const schema = Schema({
  name: { type: String }
})

module.exports = model('Category', schema)