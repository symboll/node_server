const { exec } = require('../db/mysql')

const getList = (author,keyword) => {
  let sql = `select * from blogs where 1=1`
    if(author) {
      sql += ` and author='${author}'`
    }
    if(keyword) {
      sql += ` and title like '%${keyword}%'`
    }
    sql += ` order by createtime desc;`
  return exec(sql)
}
const getDetail = (id) => {
  let sql = `select * from blogs where id=${id}`
  return exec(sql).then(rows => {
    return rows[0]
  })
}
const createBlog = blog => {
  const { title, content, author } = blog
  const createtime = Date.now()

  const sql =`
    insert into blogs (title,content, createtime, author) 
    values('${title}', '${content}', ${createtime}, '${author}');
  `
  return exec(sql).then(inserData => {
    return { id: inserData.insertId }
  })
}

const updateBlog = (id,blog) => {
  const { title, content } = blog

  const sql =`
    update blogs set title='${title}', content='${content}' where id=${id}
  `
  return exec(sql).then(res => {
    if(res.affectedRows > 0) {
      return true
    }
    return false
  })
}

const deleteBlog = (id,author) => {
  const sql = `delete from blogs where id=${id} and author='${author}'`
  return exec(sql).then(res => {
    if(res.affectedRows > 0) {
      return true
    }
    return false
  })
}
module.exports = {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog
}