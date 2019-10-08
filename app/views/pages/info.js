var Magix = require('magix')
var $ = require('jquery')

module.exports = Magix.View.extend({
  tmpl: '@info.html',
  init: function(extra) {
    this.extraData = extra
  },
  render: function() {
    var me = this
    me.data = me.extraData.data
    me.setView()
  }
})