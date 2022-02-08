module.exports = (app) => {

  const express = require('express')
  const router = express.Router()
  const Category = require('../models/Category')


  router.post('/category', async (req, res) =>{
    const model = await Category.create(req.body)
    res.send(model)
  })

  router.put('/category/:id', async (req, res) =>{
    const model = await Category.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  router.get('/category', async (req, res) =>{
    const items = await Category.find().limit(10)
    res.send(items)
  })

  router.get('/category/:id', async (req, res) =>{
    const model = await Category.findById(req.params.id)
    res.send(model)
  })

  router.delete('/category/:id', async (req, res) =>{
    await Category.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })

  app.use('/', router)
}