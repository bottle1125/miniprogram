// 云函数入口文件
const cloud = require('wx-server-sdk')
const shortid = require('shortid')

cloud.init({
  env: 'drive-223675'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let code = ''
  let ifValid = false

  while (!ifValid) {
    code = shortid.generate()
    // 检查是否重复
    const res = await db.collection('codes')
      .where({
        code
      }).get()

    ifValid = !res.data.length
  }

  return {
    status: 200,
    code
  }
}
