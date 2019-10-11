var Magix = require('magix')
var $ = require('jquery')
var util = require('app/util/index')
var mapdata = require('app/views/pages/mapdata')
var Dialog = require('app/mixins/dialog')

module.exports = Magix.View.extend({
  tmpl: '@index.html',
  mixins: [Dialog],
  render: function() {
    var me = this

    me.data = {
      switcher: {
        type: 1
      }
    }
    me.setView().then(function() {
      var windowHeight = $(window).height()
      var headerHeight = $('.header').height()
      var mainHeight = windowHeight - headerHeight
      $('.main').height(mainHeight)
      // 设置图表显示宽高
      var $falseAlarmChart = $('#falseAlarmChart')
      var $breakdownChart = $('#breakdownChart')
      var $realFireAlarmChart = $('#realFireAlarmChart')
      $falseAlarmChart.height($falseAlarmChart.parent().height())
      $breakdownChart.height($breakdownChart.parent().height())
      $realFireAlarmChart.height($realFireAlarmChart.parent().height())
      $falseAlarmChart.width($falseAlarmChart.parent().width())
      $breakdownChart.width($breakdownChart.parent().width())
      $realFireAlarmChart.width($realFireAlarmChart.parent().width())

      me.renderMap()
      me.connect()
      
      me.renderWeather()
      me.renderNetworkingTotalChart()
      me.renderFalseAlarmChart()
      me.renderBreakdownChart()
      me.renderRealFireAlarmChart()
    })
  },
  connect: function () {
    var me = this
    var connection = $.hubConnection('http://183.129.224.22:8089')
    //如果前后端为同一个端口，可不填参数。如果前后端分离，这里参数为服务器端的URL
    var chatHubProxy = connection.createHubProxy('ServiceHub')
    // ServiceHub为后端定义，使用驼峰式命名，后端首字母必须大写
    // ReveiceAlarm 为后端ServiceHub方法
    chatHubProxy.on('ReveiceAlarm', function(res, message) {
      var alarmList = res
      alarmList.forEach(function(v, i) {
        me.addAlarmMarker(v)
      })
    })
    chatHubProxy.on('ReveiceConfirm', function(res, message) {
      me.removeAlarmMarker(res)
    })
    connection.start()
      .done(function(){ 
        console.log('Now connected, connection ID=' + connection.id)
        chatHubProxy.invoke('Register')
      })
      .fail(function(){ console.log('Could not connect') })
  },
  addAlarmMarker: function(obj) {
    var me = this
    var markers = me.markers || {}
    me.request().all([{
      name: 'getLwdwxxListForTp',
      params: {
        key: 'XAlwjc119',
        startPage: 1,
        pageSize: 10,
        params: JSON.stringify({
          dwid: obj.lwdwid
        })
      }
    }], function(e, ResModel) {
      var results = ResModel.get('data').results
      if (results.length > 0) {
        var gis = util.BdmapEncryptToMapabc(results[0].gis_y, results[0].gis_x)
        var hasSameMarker = false

        for (let v in markers) {
          if (obj.lwdwid == markers[v].lwdwid) {
            hasSameMarker = true
            break
          }
        }
        if (hasSameMarker) {return}

        var marker = new AMap.Marker({
          map: me.mapInstance,
          content: '<div class="pulse-marker"></div>',
          position: [gis.lng, gis.lat]
        })
        marker.on('click', function(e) {
          me.showInfoDialog({
            lwdwid: obj.lwdwid,
            cym: results[0].cym,
            jzlb: results[0].dwcsx ? results[0].dwcsx : results[0].dwzsx,
            dwdz: results[0].dwdz,
            txdzm: obj.txdzm,
            zjh: obj.zjh,
            bjbjdzm: obj.bjbjdzm
          })
          me.mapInstance.setCenter(e.target.getPosition())
        })
        markers[obj.id] = {
          lwdwid: obj.lwdwid,
          marker: marker
        }
        me.markers = markers
      }
    })
  },
  removeAlarmMarker: function(id) {
    var markers = this.markers
    if (markers && markers[id]) {
      markers[id].marker.setMap(null)
      delete markers[id]
    }
  },
  renderMap: function () {
    var me = this
    var mapInstance = new AMap.Map('mapContainer', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 12, //初始化地图层级
      center: [120.214001, 30.247132], //初始化地图中心点
      features: ['bg', 'road', 'building'],
      mapStyle: 'amap://styles/dark'
    })

    AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {
      //创建组件实例
      var pointSimplifierIns = new PointSimplifier({
        map: mapInstance,
        getPosition: function(dataItem) {
          //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
          return dataItem.position
        },
        getHoverTitle: function(dataItem, idx) {
          return dataItem.title
        },
        renderOptions: {
          //点的样式
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              'https://img.alicdn.com/imgextra/i1/3883067843/O1CN01TQStAC27o8uH5qz02_!!3883067843.png',
              function onload() {
                pointSimplifierIns.renderLater()
              }
            ),
            //宽度
            width: 15,
            //高度
            height: 15,
            //定位点为底部中心
            offset: ['-50%', '-100%'],
            fillStyle: null,
            strokeStyle: null
          }
        }
      })

      var data = []
      mapdata.forEach(function(item, index) {
        var gis = util.BdmapEncryptToMapabc(item[2], item[1])
  
        data.push({
          position: [gis.lng, gis.lat],
          title: item[0]
        })
      })
  
      //设置数据源，data需要是一个数组
      pointSimplifierIns.setData(data)

      me.pointSimplifierIns = pointSimplifierIns
    })

    me.mapInstance = mapInstance
  },
  showInfoDialog: function(data) {
    this.mxDialog('app/views/pages/info', {
      width: 1000,
      height: 600,
      data: data
    })
  },
  getlocation: function(callback) {
    console.log('GPS定位开始+++')
    var map, geolocation
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('iCenter')
    map.plugin('AMap.Geolocation', function() {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: false,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
      })
      map.addControl(geolocation)
      geolocation.getCurrentPosition()
      
      // getCityInfo是高德GPS定位里面的一个方法，先返回ip定位数据，由于IP定位有可能不准确，所以后面用GPS数据修正
      // geolocation.getCityInfo (function(status,result) {
      //   console.log('与GPS同步IP定位开始，进行数据写入+++')
      //   if (status === 'complete' && result.info === 'SUCCESS') {
      //     console.log('同步IP定位成功，进行数据写入+++')
      //     if(!sessionStorage.getItem('autouserchooselocationct')) {
      //       console.log('未检测检查有上一次定位数据，进行数据写入+++')
      //       let cityAdcode = result.adcode
      //       let cityName = result.city
      //       sessionStorage.setItem('autouserchooselocationct', cityName)
      //       sessionStorage.setItem('autouserchooselocationcode', cityAdcode)
      //       console.log('同步IP定位结束，进行数据写入完成+++')
      //     }
      //   }
      // })
      AMap.event.addListener(geolocation, 'complete', onComplete) //返回定位信息
      AMap.event.addListener(geolocation, 'error', onError)      //返回定位出错信息
    });

    //GPS定位成功
    function onComplete(data) {
      // console.log(data)
      console.log('GPS定位启动+++')
      //gsp定位精确到区，返回的adcode精确到了城市下属的区域，
      //想要获取城市的abcode还需要使用高德的另一个API，城市区域查询
      
      let cityName = data.addressComponent.city
      let geocoder = new AMap.Geocoder({})
      //地理编码,返回地理编码结果，
      geocoder.getLocation(cityName, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          console.log('GPS定位成功，处理定位数据+++')
          let cityAdcode=result.geocodes[0].adcode
          callback({
            cityName: cityName,
            cityAdcode: cityAdcode
          })
          // sessionStorage.setItem('autouserchooselocationct', cityName)
          // sessionStorage.setItem('autouserchooselocationcode', cityAdcode)
          console.log('GPS定位结束，进行数据写入完成+++')
        }
      })
    }

    //GPS定位失败
    function onError() {
      console.log('GPS定位失败开始启用ip定位+++')
      // locationForIp(true)
      console.log('gps-ip++...')
    }
  },
  renderWeather: function () {
    var me = this
    var weaImgMap = {
      xue: 'iconzhongxue',
      lei: 'iconleidian',
      shachen: 'iconmai',
      wu: 'iconwu',
      bingbao: 'iconbingbao',
      yun: 'iconduoyun',
      yu: 'iconxiaoyu',
      yin: 'iconyin',
      qing: 'iconqing'
    }
    me.getlocation(function(cityData) {
      $.ajax({
        url: 'https://www.tianqiapi.com/api/?version=v6&cityid='+ cityData.cityAdcode + '&appid=13915239&appsecret=Ky5jEpcK',
        dataType: 'jsonp'
      }).done(function(res) {
        var weather = {
          tem: res.tem,
          wea: res.wea,
          weaImg: weaImgMap[res.wea_img],
          win: res.win,
          winSpeed: res.win_speed,
          humidity: res.humidity
        }
        me.data.cityName = cityData.cityName
        me.data.weather = weather
        me.setView()
      })
    })
    
  },
  // 联网总数
  renderNetworkingTotalChart: function() {
    var me = this
    me.request().all([{
      name: 'getLwdwAndJcdCountForTp',
      params: {
        key: 'XAlwjc119'
      }
    }], function(e, ResModel) {
      var res = ResModel.get('data')
      var lwdwzs = 2168
      
      me.data.lwdwzs = lwdwzs.toLocaleString('en-US')
      me.data.jcdzs = res.jcdzs.toLocaleString('en-US')
      me.data.lxs = 33
      me.data.zxs = 2135
      me.setView()

      var data = [{
        item: '离线',
        count: 33
      }, {
        item: '在线',
        count: 2135
      }]
      var chart = new G2.Chart({
        container: 'networkingTotalChart',
        forceFit: true,
        height: 120,
        data: data,
        padding: 14
      })
      chart.coord('theta')
      chart.tooltip({
        showTitle: false
      })
      chart.intervalStack().position('count').color('item', ['#f89a0d', '#ff6600'])
      chart.render()
    })
  },
  // 误报率
  renderFalseAlarmChart: function() {
    var me = this
    me.request().all([{
      name: 'get12MonthWblForTp',
      params: {
        key: 'XAlwjc119'
      }
    }], function(e, ResModel) {
      var res = ResModel.get('data')
      var data = []
      res.forEach(function(v, i) {
        if (i > 6) {
          data.push({
            month: v.tjrq.replace('年','-').replace('月',''),
            value: v.wbl
          })
        }
      })

      var chart = new G2.Chart({
        container: 'falseAlarmChart',
        forceFit: true,
        height: $('#falseAlarmChart').parent().height(),
        data: data,
        padding: [20, 30, 70, 40]
      })
      chart.axis('month', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        line: {
          stroke: '#333', // 设置线的颜色
        }
      })
      chart.axis('value', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        grid: {
          lineStyle: {
            stroke: '#333'
          }
        }
      })
      chart.scale({
        month: {
          alias: '月份' // 为属性定义别名
        },
        value: {
          alias: '误报率' // 为属性定义别名
        }
      })
      chart.area().position('month*value').color('value', ['#9c4003']).tooltip(false)
      chart.line().position('month*value').color('value', ['#c25004'])
      chart.render()
    })
  },
  // 故障率
  renderBreakdownChart: function() {
    var me = this
    me.request().all([{
      name: 'get12MonthGzlForTp',
      params: {
        key: 'XAlwjc119'
      }
    }], function(e, ResModel) {
      var res = ResModel.get('data')
      var data = []
      res.forEach(function(v, i) {
        if (i > 6) {
          data.push({
            month: v.tjrq.replace('年','-').replace('月',''),
            value: v.gzl
          })
        }
      })

      var chart = new G2.Chart({
        container: 'breakdownChart',
        forceFit: true,
        height: $('#breakdownChart').parent().height(),
        data: data,
        padding: [20, 30, 70, 40]
      })
      chart.axis('month', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        line: {
          stroke: '#333', // 设置线的颜色
        }
      })
      chart.axis('value', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        grid: {
          lineStyle: {
            stroke: '#333'
          }
        }
      })
      chart.scale({
        month: {
          alias: '月份' // 为属性定义别名
        },
        value: {
          alias: '故障率' // 为属性定义别名
        }
      })
      chart.area().position('month*value').color('value', ['#9c4003']).tooltip(false)
      chart.line().position('month*value').color('value', ['#c25004'])
      chart.render()
    })    
  },
  // 真实火警
  renderRealFireAlarmChart: function() {
    var me = this
    me.request().all([{
      name: 'get12MonthZshjForTp',
      params: {
        key: 'XAlwjc119'
      }
    }], function(e, ResModel) {
      var res = ResModel.get('data')
      var data = []
      res.forEach(function(v, i) {
        if (i > 2) {
          data.push({
            month: v.tjrq.replace('年','-').replace('月',''),
            value: v.zshjs
          })
        }
      })
      var chart = new G2.Chart({
        container: 'realFireAlarmChart',
        forceFit: true,
        height: $('#realFireAlarmChart').parent().height(),
        data: data,
        padding: [10, 20, 60, 50]
      })
      chart.axis('month', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        line: {
          stroke: '#333', // 设置线的颜色
        }
      })
      chart.axis('value', {
        label: {
          textStyle: {
            fill: '#ccc', // 文本的颜色
          }
        },
        grid: {
          lineStyle: {
            stroke: '#333'
          }
        }
      })
      chart.scale({
        month: {
          alias: '月份' // 为属性定义别名
        },
        value: {
          alias: '火警数' // 为属性定义别名
        }
      })
      chart.interval().position('month*value').color('value', function(value) {
        if (value > 100) {
          return '#ff6600'
        } else if (value < 50) {
          return '#f89a0d'
        }
      })
      chart.render()
    })
  },
  'switchPoiner<click>': function(e) {
    var type = this.data.switcher.type
    this.data.switcher = {
      type: !type
    }
    this.setView()

    if (!type) {
      this.pointSimplifierIns.show()
    } else {
      this.pointSimplifierIns.hide()
    }
  }
})