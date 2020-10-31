const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const getCookieExpires = () => {
  let d = new Date()
  d.setTime(d.getTime() + (24* 60*60*1000))
  return d.toGMTString()
}

const getPostData = req => {
  return new Promise((resolve,reject)=> {
    if(req.method !== 'POST') {
      return resolve({})
    }
    if(req.headers['content-type'] !== 'application/json') {
      return resolve({})  
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', ()=> {
      if(!postData) {
        return resolve({})  
      }
      return resolve(
        JSON.parse(postData)
      )
    })
  })
}

// const serverHandle = (req, res) => {
async function serverHandle (req, res) {

  // const orginList = ['http://localhost:3000','http://localhost:8080']

  res.setHeader('Content-type','application/json')
  // if(orginList.includes(req.headers.origin)) {
  //   res.setHeader("Access-Control-Allow-Origin",req.headers.origin )
  // }
  
  const url = req.url
  req.path = url.split('?')[0]

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item) {
      return
    }
    const key = item.split('=')[0].trim()
    const val = item.split('=')[1].trim()

    req.cookie[key] = val
  })

  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  // 解析params
  await getPostData(req).then(postData => {
    req.body = postData
  })

  // 解析session
  const SESSION_DATA= {}
  let needSetCookie = false
  let userId = req.cookie.userid
  if(userId) {
    if(!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  }else {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]


  const blogResult = handleBlogRouter(req, res)
  if(blogResult) {
    blogResult.then(blogData => {
      if(needSetCookie){
        res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
      }
      res.end(JSON.stringify(blogData))
    })
    return
  }

  const userResult = handleUserRouter(req, res)
  if(userResult) {
    userResult.then(userData => {
      if(needSetCookie){
        res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
      }
      res.end(JSON.stringify(userData) )
    })
    return
  } 
  
  res.writeHead(404, {'Content-type': "text/plain"})
  res.write('404 Not Found\n')
  res.end()
}


module.exports = serverHandle;