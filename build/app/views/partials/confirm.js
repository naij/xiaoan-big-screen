/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: xinglie.lkf@alibaba-inc.com; kooboy_li@163.com
 */
define('app/views/partials/confirm',["magix","jquery"],function(require,exports,module){
/*Magix,$*/
var Magix = require('magix')
var $ = require('jquery')

module.exports = Magix.View.extend({
  tmpl: "<div class=\"confirm-dialog\"><div class=\"dialog-hd\"><h2 class=\"dialog-title\">{{title}}</h2></div><div class=\"dialog-bd\">{{body}}</div><div class=\"dialog-ft\"><a href=\"javascript:;\" class=\"btn btn-brand btn-large mr10\" mx-click=\"submit()\">确定</a><a href=\"javascript:;\" class=\"btn btn-large mr10\" mx-click=\"cancel()\">取消</a></div></div>",
  ctor: function() {
    this.observe(null, true)
  },
  init: function(extra) {
    this.extraData = extra
  },
  render: function() {
    this.data = this.extraData
    this.data.title = this.data.title || '提示'
    this.setView()
  },
  'submit<click>': function(e) {
    e.preventDefault()
    if (this.extraData.enterCallback) {
      this.extraData.enterCallback()
    }
    this.extraData.dialog.close()
  },
  'cancel<click>': function(e) {
    e.preventDefault()
    if (this.extraData.cancelCallback) {
      this.extraData.cancelCallback()
    }
    this.extraData.dialog.close()
  },
})
});