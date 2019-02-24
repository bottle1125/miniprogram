// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'te-3db4f8'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { code } = event

  const startTime = Math.ceil(new Date().getTime() / 1000)
  const duration = 30 * 24 * 60 * 60
  const endTime = startTime + duration

  await db.collection('codes')
    .where({
      code
    })
    .update({
      data: {
        start_time: startTime,
        end_time: endTime,
        active: 1,
        openid: wxContext.OPENID
      }
    })

  return {
    status: 200
  }
}
