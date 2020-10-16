/**
 * 员工
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const schema = Schema({
  __v: {type: Number, select: false},
  name: { type: String },
  jobNo: { type: String },
  hiredate: { type: String }
})

module.exports = model('Staff', schema)
