const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getCurrentDate = () => {
  var nowdate = new Date()
  var y = nowdate.getFullYear()
  var m = nowdate.getMonth() + 1
  var d = nowdate.getDate()

  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }

  var formatnowdate = y + '-' + m + '-' + d

  return formatnowdate
}

const getLastWeek = () => {
  var nowdate = new Date()
  var oneweekdate = new Date(nowdate - 6 * 24 * 3600 * 1000)
  var y = oneweekdate.getFullYear()
  var m = oneweekdate.getMonth() + 1
  var d = oneweekdate.getDate()

  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }

  var formatwdate = y + '-' + m + '-' + d

  return formatwdate
}

const getLastMonth = () => {
  var nowdate = new Date()
  nowdate.setMonth(nowdate.getMonth() - 1)
  var y = nowdate.getFullYear()
  var m = nowdate.getMonth() + 1
  var d = nowdate.getDate()

  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }

  var formatwdate = y + '-' + m + '-' + d

  return formatwdate
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const BdmapEncryptToMapabc = (bd_lat, bd_lon) => {
  var point = new Object()
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0
  var x = new Number(bd_lon - 0.0065)
  var y = new Number(bd_lat - 0.006)
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var Mars_lon = z * Math.cos(theta)
  var Mars_lat = z * Math.sin(theta)
  point.lng = Mars_lon
  point.lat = Mars_lat
  return point
}
window.util = {
  formatTime: formatTime,
  getCurrentDate: getCurrentDate,
  getLastWeek: getLastWeek,
  getLastMonth: getLastMonth,
  BdmapEncryptToMapabc: BdmapEncryptToMapabc
}
