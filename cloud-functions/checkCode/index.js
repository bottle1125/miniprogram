// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'te-3db4f8'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { code } = event

  const reqGetCode = await db.collection('codes')
    .where({
      code
    })
    .get()

  // 不存在该激活码
  if (!reqGetCode.data.length) {
    return {
      status: 404,
      errMsg: '该激活码无效'
    }
  }

  // 激活码是否已绑定
  const reqUserCode = await db.collection('user_code')
    .where({
      code
    })
    .get()

  const userCodeData = reqUserCode.data[0]

  // 已被绑定
  if (userCodeData && userCodeData._openid !== wxContext.OPENID) {
    return {
      status: 403,
      errMsg: '该激活码已绑定其他用户'
    }
  }

  // 是否过期
  const nowTime = Math.ceil(new Date().getTime() / 1000)
  if (userCodeData && nowTime >= userCodeData.end_time) {
    return {
      status: 400,
      errMsg: '该激活码已过期'
    }
  }

  return {
    status: 200,
    code: reqGetCode.data[0]
  }
}
