// 云函数：数据同步
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, userId, data } = event
  
  if (!userId) {
    return { success: false, error: '缺少 userId' }
  }

  const collection = db.collection('users')
  const docId = userId

  try {
    if (action === 'upload') {
      // 上传数据
      await collection.doc(docId).set({
        data: {
          ...data,
          updatedAt: db.serverDate()
        }
      })
      return { success: true, message: '上传成功' }
    } 
    else if (action === 'download') {
      // 下载数据
      const result = await collection.doc(docId).get()
      if (result.data) {
        return { success: true, data: result.data }
      } else {
        return { success: false, error: '云端暂无数据' }
      }
    }
    else {
      return { success: false, error: '未知操作' }
    }
  } catch (error) {
    console.error('同步失败:', error)
    return { success: false, error: error.message }
  }
}
