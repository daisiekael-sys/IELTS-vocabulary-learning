// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const { code } = event
  
  if (!code) {
    return {
      success: false,
      error: '缺少 code 参数'
    }
  }

  try {
    // 调用微信接口换取 openid
    const result = await cloud.openapi.auth.code2Session({
      jsCode: code
    })

    return {
      success: true,
      openid: result.openid,
      sessionKey: result.session_key,
      unionid: result.unionid || null
    }
  } catch (error) {
    console.error('获取 openid 失败:', error)
    return {
      success: false,
      error: error.message || '获取 openid 失败'
    }
  }
}
