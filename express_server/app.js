const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

require('./src/plugins/db')(app)
require('./src/routes')(app)

 
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})