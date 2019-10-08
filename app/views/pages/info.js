var Magix = require('magix')
var $ = require('jquery')

module.exports = Magix.View.extend({
  tmpl: '@info.html',
  init: function(extra) {
    this.extraData = extra
  },
  render: function() {
    var me = this
    // me.request().all([{
    //   name: 'picture_list'
    // }], function(e, MesModel) {
    //   var data = MesModel.get('data')

    //   me.data = {
    //     list: data.list,
    //     selectedList: []
    //   }
    //   me.setView()
    // })
    me.setView()
  }
})