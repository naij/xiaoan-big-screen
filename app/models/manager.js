var Service = require('app/models/service')

Service.add([
  // 登录
  {
    name: 'login',
    url: '/api/member/admin/login.json',
    method: 'POST'
  }
])

module.exports = Service
