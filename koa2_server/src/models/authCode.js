/**
 * 权限
 * 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const schema = Schema({
  __v: {type: Number, select: false},
  code: { 
    type: String, 
    required: true 
  },       // 权限码
  type: { 
    type: String,
    required: true,
    enum: ['PAGE', 'FUNC']
  }        // 权限码类别
}, { timestamps: true })



module.exports = model('AuthCode', schema)