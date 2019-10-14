/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: xinglie.lkf@alibaba-inc.com; kooboy_li@163.com
 */
define('app/views/layout/default',["magix"],function(require,exports,module){
/*Magix*/
var Magix = require('magix')
var Router = Magix.Router

module.exports = Magix.View.extend({
  tmpl: "<div mx-view=\"{{mainView}}\"></div>",
  ctor: function() {
    this.observe(null, true)
  },
  render: function() {
    var me = this
    var loc = Router.parse()
    var path = loc.path

    if (path === '/') {
      path = '/index'
    }

    me.data = {
      mainView: 'app/views/pages' + path
    }
    me.setView()
    me.animateLoading()
  }
})
});