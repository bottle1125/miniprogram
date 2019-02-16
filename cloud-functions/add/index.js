// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
  const resultValue = await request({
    method: 'GET',
    url: 'https://www.jianshu.com/asimov/notes/33604208/reward_section'
  })

  return { resultValue }
}
