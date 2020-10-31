const { 
  getList, 
  getDetail, 
  createBlog, 
  updateBlog, 
  deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = req => {
  if(!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录!')
    )
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id || ''

  if(method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''

    return getList(author,keyword).then(postdata => {
      return new SuccessModel(postdata)
    }).catch((e) => {
      return new ErrorModel('查询数据失败')
    })
  }

  if(method === 'GET' && req.path === '/api/blog/detail') {
    return getDetail(id).then(res => {
      return new SuccessModel(res)
    }).catch(e => {
      return new ErrorModel(e)
    })
  }

  if(method === 'POST' && req.path === '/api/blog/create') {
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult) {
      return loginCheckResult
    }
    req.body.author = req.session.username
    return createBlog(req.body).then(res => {
      return new SuccessModel(res)
    }).catch( e => {
      return new ErrorModel(e)
    })
  }

  if(method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult) {
      return loginCheckResult
    }
    return updateBlog(id, req.body).then(res => {
      if(res) {
        return new SuccessModel()
      }else {
        return new ErrorModel('更新博客失败！')
      }
    })
  }

  if(method === 'POST' && req.path === '/api/blog/delete') {
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult) {
      return loginCheckResult
    }
    req.body.author = req.session.username
    return deleteBlog(id, author).then(res => {
      if(res) {
        return new SuccessModel()
      } else {
        return new ErrorModel()
      }
    })
  }
}

module.exports = handleBlogRouter