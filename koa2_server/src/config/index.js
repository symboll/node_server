module.exports = {
  // database: {
  //   dbName: 'apple',
  //   host: 'localhost',
  //   port: 3306,
  //   user: 'root',
  //   password: '08928214lkh'
  // },
  mdb: {
    host: "mongodb://127.0.0.1",
    port: "27017",
    dbName: 'symbol'
  },
  security: {
    key: 'Symbol',
    expiresIn: 60* 60      // 单位秒  
  },
  options: {
    maxAge: 60* 60 * 1000,  // 单位毫秒  
    // signed: "",
    // expires:"",
    path: "/",
    // domain: "",
    // secure: "",
    httpOnly: true,
    // overwrite: true
  }
}