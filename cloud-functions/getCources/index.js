// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'drive-223675'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { classId } = event
  const result = await db.collection('courses')
    .where({
      classId
    })
    .get()

  return result.data
}
