/**
 * 用户
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema, model } = mongoose

const schema = Schema({
  __v: {type: Number, select: false},
  username: { type: String, required: true  },
  avatar: { type: String },
  password: { 
    type: String, 
    required: true, 
    get: val => val,
    set (val) {
      const salt = bcrypt.genSaltSync(10)
      return bcrypt.hashSync(val, salt)
    }
  },
  email: { type: String, required: true, unique: true },
  role: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Role"
    }]
  },
  city: { type: String },
  sex: { type: String, enum: ['male', 'female'] }
}, { timestamps: true })
 
module.exports = model('User', schema)