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
  auth: { 
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'AuthCode', 
    }], 
    required: true
  }
})
 
 module.exports = model('Role', schema)