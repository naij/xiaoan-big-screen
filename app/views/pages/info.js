var Magix = require('magix')
var $ = require('jquery')

module.exports = Magix.View.extend({
  tmpl: '@info.html',
  init: function(extra) {
    this.extraData = extra
  },
  render: function() {
    var me = this
    var extraData = me.extraData.data
    me.data = extraData
    me.request().all([{
      name: 'getXfssbjXxForTp',
      params: {
        key: 'XAlwjc119',
        params: JSON.stringify({
          txdzm: extraData.txdzm,
          zjh: extraData.zjh,
          bjdzm: extraData.bjbjdzm
        })
      }
    }], function(e, ResModel) {
      var res = ResModel.get('data')
      $.extend(me.data, {
        wdsx: me.getRandomArbitrary(1.8, 2.0),
        dxsc: me.getRandomArbitrary(1.8, 2.0),
        plmd: me.getRandomArbitrary(0.05, 0.07),
        xhsmd: me.getRandomArbitrary(0.6, 0.9),
        azwz: res ? res.azwz : '待标注',
        bjlx: res ? res.bjlx : '待标注'
      })
      me.setView()
    })
  },
  getRandomArbitrary: function(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2)
  }
})