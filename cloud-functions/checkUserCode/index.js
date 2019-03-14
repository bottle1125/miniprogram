// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'drive-223675'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let reqGetCode = null
  // 直接验证
  reqGetCode = await db.collection('user_code')
    .where({
      _openid: wxContext.OPENID
    })
    .get()

  if (!reqGetCode.data.length) {
    // 没有激活码
    return {
      status: 404,
      errMsg: '未绑定激活码'
    }
  }

  const data = reqGetCode.data[0]

  // 是否在有效期内
  const endTime = data.end_time
  const nowTime = Math.ceil(new Date().getTime() / 1000)

  if (nowTime >= endTime) {
    // 过期
    return {
      status: 403,
      errMsg: '激活码已过期'
    }
  }

  return {
    status: 200
  }
}
