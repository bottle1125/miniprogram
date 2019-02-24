// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'te-3db4f8'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const res = await db.collection('codes')
    .where({
      _openid: 'o_rgP5ar53NxbcSezxV85xXE3bgE'
    })
    .get()

  return {
    result: res
  }

  // const res = await db.collection('users')
  //   .where({
  //     openid: wxContext.OPENID
  //   })
  //   .field({
  //     _id: false,
  //     openid: false
  //   })
  //   .get()

  //   // 该用户不存在
  // if (!res.data.length) {
  //   return {
  //     status: 404,
  //     errMsg: '该用户不存在'
  //   }
  // }

  // return {
  //   status: 200,
  //   userinfo: res.data[0]
  // }
}
