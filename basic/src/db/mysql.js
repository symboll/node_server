const mysql = require('mysql')
const { dbConfig } = require('../config/db')

const con = mysql.createConnection(dbConfig)

con.connect()

function exec(sql) {
  return new Promise((resolve, reject)=> {
    con.query(sql, (err, result) => {
      if(err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

module.exports = {
  exec
}