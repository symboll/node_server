const mongoose = require('mongoose')
const { mdb: { host,port, dbName } } = require('../config')

mongoose.connect(`${host}:${port}/${dbName}`,{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false
})
