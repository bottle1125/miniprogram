// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'drive-223675'
})

var AipSpeechClient = require('baidu-aip-sdk').speech

// 设置APPID/AK/SK
var APP_ID = '15645191'
var API_KEY = '6ymy3Dv9bD6TRIgn0weNVbDk'
var SECRET_KEY = 'M3IKl8Oi3sOWFcy7uH0xgjLO7qZI8h1X'

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY)

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const { text, path } = event

  const res = await client.text2audio(text)

  const data = res.data

  await cloud.uploadFile({
    cloudPath: path,
    fileContent: data
  })

  return {
    data
  }
}
