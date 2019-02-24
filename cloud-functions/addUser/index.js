// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'te-3db4f8'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userinfo } = event
  await db.collection('users')
    .add({
      data: {
        token: wxContext.OPENID,
        ...userinfo,
        user_id: 1000
      }
    })

  return {
    userinfo: {
      ...userinfo,
      user_id: 1000
    }
  }
}
