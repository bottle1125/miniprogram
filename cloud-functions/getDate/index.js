// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const nowTime = Math.ceil(new Date().getTime() / 1000)

  return {
    time: nowTime
  }
}
