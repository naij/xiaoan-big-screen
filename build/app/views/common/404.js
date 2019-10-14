/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: xinglie.lkf@alibaba-inc.com; kooboy_li@163.com
 */
define('app/views/common/404',["magix"],function(require,exports,module){
/*Magix*/
var Magix = require('magix')

module.exports = Magix.View.extend({
  tmpl: "<div class=\"status-404\"><img src=\"/assets/img/404.jpg\"></div>",
  render: function() {
    var me = this
    me.setView()
  }
})
});