var Service = require('app/models/service')

Service.add([
  // 获取联网单位基本信息列表
  {
    name: 'getLwdwxxListForTp',
    url: '/tp/getLwdwxxListForTp',
    method: 'POST'
  }
])

module.exports = Service
