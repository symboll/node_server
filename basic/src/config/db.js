const isEnv = process.env.NODE_ENV === 'dev'

const dbConfig = {
  host: isEnv ? 'localhost' : '',
  user: isEnv ? 'root': '',
  password: isEnv ?'08928214lkh': '',
  port: isEnv ?'3306':'',
  database: isEnv ? 'basic' :''
}

const redisConfig = {
  port: isEnv ? 6379 : 0,
  host: isEnv? '127.0.0.1': ''
}

module.exports = {
  dbConfig,
  redisConfig
}