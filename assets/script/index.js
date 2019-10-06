$(function() {
  // 设置main容器的高度，保证在一屏中显示完整的页面
  $('#main').height($(window).height() - $('.header').height())

  // 天气预报
  function weather() {
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

    $.ajax({
      url: "https://www.tianqiapi.com/api/?version=v6&cityid=101210101&appid=13915239&appsecret=Ky5jEpcK",
      dataType: 'jsonp'
    }).done(function(res) {
      var tem = res.tem + '<span class="symbol">℃</span>'
      var wea = res.wea
      var weaImg = '<span class="iconfont ' + weaImgMap[res.wea_img] + '"></span>'
      var win = res.win
      var winSpeed = res.win_speed
      var humidity = '空气湿度 ' + res.humidity

      $('#J_tem').html(tem)
      $('#J_wea').html(wea)
      $('#J_wea_img').html(weaImg)
      $('#J_win').html(win + ' ' + winSpeed)
      $('#J_humidity').html(humidity)
    })
  }
  weather()

  // 显示高德地图
  function renderMap() {
    // 百度地图系转高德地图系
    var BdmapEncryptToMapabc = (bd_lat, bd_lon) => {
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

    var map = new AMap.Map('mapContainer', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 12, //初始化地图层级
      center: [120.214001, 30.247132], //初始化地图中心点
      features: ['bg', 'road', 'building'],
      // mapStyle: 'amap://styles/3b563d6db6bd30bc836a6d7c849d9b1f'
      mapStyle: 'amap://styles/dark'
    })

    var poinerIcon = 'https://img.alicdn.com/imgextra/i1/3883067843/O1CN0147qDXG27o8tBXO548_!!3883067843.png'
    var markerArr = []
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
    function markerClick(e) {
      infoWindow.setContent(e.target.content)
      infoWindow.open(map, e.target.getPosition())
    }
    // localGISMap.forEach(function(item, index) {
    //   var gis = BdmapEncryptToMapabc(item[1], item[2])

    //   var marker = new AMap.Marker({
    //     position: new AMap.LngLat(gis.lat, gis.lng),
    //     icon: poinerIcon
    //   })
    //   marker.content = item[0]
    //   marker.on('click', markerClick)
    //   marker.emit('click', {target: marker})
    //   markerArr.push(marker)
    // })
    // map.add(markerArr)
  }
  renderMap()

  function fetch() {
    // 误报率
    $.ajax({
      url: 'http://127.0.0.1:8989/tp/get12MonthWblForTp',
      type: 'POST',
      data: {
        key: 'XAlwjc119'
      }
    }).done(function(res) {
      console.log(res)
    })

    // 故障率
    $.ajax({
      url: 'http://127.0.0.1:8989/tp/get12MonthGzlForTp',
      type: 'POST',
      data: {
        key: 'XAlwjc119'
      }
    }).done(function(res) {
      console.log(res)
    })

    // 联网单位总数
    $.ajax({
      url: 'http://127.0.0.1:8989/tp/getLwdwAndJcdCountForTp',
      type: 'POST',
      data: {
        key: 'XAlwjc119'
      }
    }).done(function(res) {
      console.log(res)
    })

    // 真实火警数
    $.ajax({
      url: 'http://127.0.0.1:8989/tp/get12MonthZshjForTp',
      type: 'POST',
      data: {
        key: 'XAlwjc119'
      }
    }).done(function(res) {
      console.log(res)
    })
  }
  fetch()


  // 信息浮层
  function layer() {
    var $infoLayer = $('#J_info_layer')
    var $close = $infoLayer.find('.close')
    var $parent = $infoLayer.parent()
    $parent.addClass('relative')
    $infoLayer.fadeIn()
    $close.click(function(e) {
      $infoLayer.fadeOut(200, function() {
        $parent.removeClass('relative')
      })
    })
  }
  layer()

  // 联网情况图表数据
  function networkingTotalChart() {
    var data = [{
      item: '离线',
      count: 84
    }, {
      item: '在线',
      count: 1614
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
    chart.intervalStack().position('count').color('item', ['#f89a0d', '#c25004'])
    chart.render()
  }

  // 真实火警数图表数据
  function realFireAlarmChart() {
    var data = [
      { month: '1月', value: 38 },
      { month: '2月', value: 52 },
      { month: '3月', value: 61 },
      { month: '4月', value: 145 },
      { month: '5月', value: 48 },
      { month: '6月', value: 38 },
      { month: '7月', value: 38 },
      { month: '8月', value: 38}
    ]
    var chart = new G2.Chart({
      container: 'realFireAlarmChart',
      forceFit: true,
      height: $('#realFireAlarmChart').parent().height(),
      data: data,
      padding: [10, 10, 60, 40]
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
      }
    })
    chart.render()
  }

  // 误报率图表数据
  function falseAlarmChart() {
    var data = [
      { month: '1月', value: 4.04 },
      { month: '2月', value: 4.88 },
      { month: '3月', value: 5.32 },
      { month: '4月', value: 5.38 },
      { month: '5月', value: 6.14 },
      { month: '6月', value: 5.10 },
      { month: '7月', value: 4.89 },
      { month: '8月', value: 4.04 }
    ]
    var chart = new G2.Chart({
      container: 'falseAlarmChart',
      forceFit: true,
      height: $('#falseAlarmChart').parent().height(),
      data: data,
      padding: [20, 10, 60, 40]
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
  }

  // 故障率图表数据
  function breakdownChart() {
    var data = [
      { month: '1月', value: 3.46 },
      { month: '2月', value: 3.05 },
      { month: '3月', value: 4.80 },
      { month: '4月', value: 5.00 },
      { month: '5月', value: 4.64 },
      { month: '6月', value: 4.90 },
      { month: '7月', value: 5.04 },
      { month: '8月', value: 4.54 }
    ]
    var chart = new G2.Chart({
      container: 'breakdownChart',
      forceFit: true,
      height: $('#breakdownChart').parent().height(),
      data: data,
      padding: [20, 10, 60, 40]
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
  }

  setTimeout(() => {
    // 设置图表显示宽高
    let $falseAlarmChart = $('#falseAlarmChart')
    let $breakdownChart = $('#breakdownChart')
    let $realFireAlarmChart = $('#realFireAlarmChart')
    $falseAlarmChart.height($falseAlarmChart.parent().height())
    $breakdownChart.height($breakdownChart.parent().height())
    $realFireAlarmChart.height($realFireAlarmChart.parent().height())
    $falseAlarmChart.width($falseAlarmChart.parent().width())
    $breakdownChart.width($breakdownChart.parent().width())
    $realFireAlarmChart.width($realFireAlarmChart.parent().width())
    
    networkingTotalChart()
    realFireAlarmChart()
    falseAlarmChart()
    breakdownChart()
  }, 1000);
})