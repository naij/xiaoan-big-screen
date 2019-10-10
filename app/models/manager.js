var Service = require('app/models/service')

Service.add([
  // 获取联网单位基本信息列表
  {
    name: 'getLwdwxxListForTp',
    url: '/tp/getLwdwxxListForTp',
    method: 'POST'
  },
  // 真实火警
  {
    name: 'get12MonthZshjForTp',
    url: '/tp/get12MonthZshjForTp',
    method: 'POST'
  },
  // 误报率
  {
    name: 'get12MonthWblForTp',
    url: '/tp/get12MonthWblForTp',
    method: 'POST'
  },
  // 故障率
  {
    name: 'get12MonthGzlForTp',
    url: '/tp/get12MonthGzlForTp',
    method: 'POST'
  },
  // 联网单位总数
  {
    name: 'getLwdwAndJcdCountForTp',
    url: '/tp/getLwdwAndJcdCountForTp',
    method: 'POST'
  },
])

module.exports = Service
