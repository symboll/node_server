
/**
 *
 * 辅助类
 * @class Auxiliary
 * 
 */
class Auxiliary {
  /**
   * 普通查询
   *
   * @param {*} model    // 查询的模型
   * @param {*} listName    // result 返回数据列表的字段名 String 
   * @param {*} [{ supplementModel, supplementName, maskfield, element }={}] 外链表查询的 模型， 字段名， 隐藏字段
   * @param {*} [{ limit, select=''}={}]     主表查询时候 条数限制 和 隐藏字段 
   * @returns
   * @memberof Auxiliary
   */
  async generalQuery (model, listName, 
    { supplementModel, supplementName, maskfield }={}, 
    { limit, select=''}={}) {
    const result = { total: 0 }
    try {
      result.total = await model.countDocuments()
      if(result.total) {
        const res = await model.find()
          .select(select)
          .limit(limit)
          .sort({ createdAt: 'desc' })
        if(supplementName) {
          for(let key of res) {
            if(key[supplementName] && key[supplementName].length > 0){ 
              key[supplementName] = await this.supplementQuery(
                supplementModel,
                key[supplementName], 
                maskfield)
            }
          }
        }
        result[listName] = res
      }
      
      return result
    } catch (err) {
      throw new Exception('查询失败' + err.message)
    }
  }
  /**
   * 补充查询
   *
   * @param {*} model
   * @param {*} query
   * @param {*} maskfield
   * @returns
   * @memberof Auxiliary
   */
  async supplementQuery (model, query,  maskfield) {
    try {
      return await model.find(
        { _id: { $in: query } }, maskfield )
    }catch(e) {
      return []
    }
  }

  /**
   * 条件查询
   *
   * @param {*} model
   * @param {*} query
   * @param {*} listName
   * @param {*} [{ supplementModel, supplementName, maskfield, element }={}]
   * @param {*} [{ select='' }={}]
   * @returns
   * @memberof Auxiliary
   */
  async conditionalQuery (model, query, listName, 
    { supplementModel, supplementName, maskfield, element }={},
    { select='' }={}) {

    const { pageNo=1, pageSize=10 } = query
    const fuzzy = await this.fuzzyCreate(query, element)
    const result = { total: 0 }

    console.log('fuzzy--->', fuzzy)

    try {
      result.total = await model.countDocuments(fuzzy)
      if(result.total) {
        const res = await model.find(fuzzy)
          .select(select)
          .skip((pageNo - 1) * (parseInt(pageSize)|| 10))
          .limit(parseInt(pageSize)|| 10)
          .sort({ createdAt: 'desc' })
      
        if(supplementName) {
          for(let key of res) {
            if(key[supplementName] && key[supplementName].length > 0){ 
              key[supplementName] = await this.supplementQuery(
                supplementModel,
                key[supplementName], 
                maskfield)
            }
          }
        }

        result[listName] = res
      }
      return result
    } catch (err) {
      throw new Exception('查询失败' + err.message)
    }
  }

  async create (model, params) {
    try {
      await model.create(params)
    }catch (err) {
      throw new Exception({ message: '创建失败!'+ err.message })
    }
  }

  async update (model, id, params) {
    try {
      await model.findByIdAndUpdate(id, params)
    }catch (err) {
      throw new Exception({ message: '更新失败!'+ err.message })
    }
  }
  async remove (model, id) {
    try {
      await model.findByIdAndRemove(id)
    }catch (err) {
      throw new Exception({ message: '删除失败!'+ err.message })
    }
  }

  async fuzzyCreate (query, element = '') {
    const { pageSize, pageNo, [`${element}[]`]: val,  ...p } = query
    const and = [], elemMatch = {}
    const fuzzy = {}
    const q = Object.keys(p)

    for(let k of q) {
      if(k ==='id'|| k==='_id') {
        and.push({ '_id': query[k] })
      }else if(!isNaN(Number(p[k])) ){
        and.push({ [k]: query[k] })
      }else {
        and.push({ [k]: new RegExp(query[k]) })
      }
    }
    if(val) {
      if(Array.isArray(val)) { 
        for(let i of val) {
          and.push({
            [element]: { $elemMatch: { $eq: i }}
          })
        }
      }else {
        elemMatch['$elemMatch'] = {$eq: val}
      }
    }
    if(and.length) fuzzy['$and'] = and
    if(Object.keys(elemMatch).length !==0) fuzzy[element] = elemMatch
    
    return fuzzy
  }
}

const aux = new Auxiliary()
module.exports = aux