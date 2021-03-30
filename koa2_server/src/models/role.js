/**
 * 角色
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const schema = Schema({
  __v: {type: Number, select: false},
  name: { 
    type: String, 
    required: true
  },       // 角色名
  level: {
    type: Number,
    required: true,
    default: 1
  },
  auth: { 
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'AuthCode', 
    }], 
    required: true
  }
}, { timestamps: true })
 
 module.exports = model('Role', schema)