/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: xinglie.lkf@alibaba-inc.com; kooboy_li@163.com
 */
define('app/coms/dialog/dialog',["magix","jquery"],function(require,exports,module){
/*Magix,$*/
var Magix = require('magix')
var $ = require('jquery')
var DialogZIndex = 10040
var CacheList = []
var RemoveCache = function(view) {
  for (var i = CacheList.length - 1, one; i >= 0; i--) {
    one = CacheList[i]
    if (one.id == view.id) {
      CacheList.splice(i, 1)
      break
    }
  }
}
module.exports = Magix.View.extend({
  tmpl: "<div class=\"dialog-backdrop dialog-anim-mask\" style=\"display: block;z-index:{{zIndex-1}}\" id=\"dialog_mask_{{viewId}}\"></div><div class=\"dialog-scroll-cnt\" style=\"z-index:{{zIndex}};\"><div class=\"dialog dialog-anim-body\" id=\"dialog_body_{{viewId}}\" style=\"left:{{left}}px;top:{{top}}px;width:{{width}}px;height:{{height}}px;\"><div mx-click=\"close()\" class=\"dialog-close {{ closable ? '' : 'none' }}\"></div><div class=\"dialog-content dialog-content-ext\" id=\"cnt_{{viewId}}\"><div class=\"loading loading-ext\"><span></span></div></div></div></div>",
  init: function(extra) {
    var me = this
    me.on('destroy', function() {
      RemoveCache(me)
      DialogZIndex -= 2
      $('#' + me.id).trigger('close').remove()
    })
    if (!Magix.has(extra, 'closable')) {
      extra.closable = true
    }
    me.data = extra
    me.setView()

    DialogZIndex += 2
    CacheList.push(me)
  },
  render: function() {
    var me = this
    me.data.zIndex = DialogZIndex
    me.data.viewId = me.id
    me.setView()

    $('#' + me.id).show()
    $('#focus_' + me.id).focus()
    me.owner.mountVframe('cnt_' + me.id, me.data.view, me.data)
    setTimeout(me.wrapAsync(function() {
      $('#dialog_body_' + me.id).removeClass('dialog-anim-body')
      $('#dialog_mask_' + me.id).removeClass('dialog-anim-mask')
    }), 300)
  },
  fireLeave: function(e) {
    var vf = Magix.Vframe.get('cnt_' + this.id)
    vf.invoke('fire', ['unload', e])
  },
  'close<click>': function() {
    $('#' + this.id).trigger('dlg_close')
  },
  '$doc<keyup>': function(e) {
    if (e.keyCode == 27) { //esc
      var dlg = CacheList[CacheList.length - 1]
      if (dlg == this && dlg.updater.get('closable')) {
        var node = $('#' + dlg.id)
        node.trigger('dlg_close')
      }
    }
  }
}, {
  show: function(view, options) {
    var id = Magix.guid('dlg_')
    $(document.body).append('<div id="' + id + '" style="display:none" />')
    var vf = view.owner.mountVframe(id, 'app/coms/dialog/dialog', options)
    var node = $('#' + id)
    var suspend
    return node.on('dlg_close', function() {
      if (!node.data('closing') && !suspend) {
        var resume = function() {
          node.data('closing', 1)
          $('#dialog_body_' + id).addClass('dialog-anim-body-out')
          $('#dialog_mask_' + id).addClass('dialog-anim-mask-out')
          setTimeout(function() {
            view.owner.unmountVframe(id)
          }, 200)
        }
        var e = {
          prevent: function() {
            suspend = 1
          },
          resolve: function() {
            e.p = 1
            suspend = 0
            resume()
          },
          reject: function() {
            e.p = 1
            suspend = 0
          }
        }
        vf.invoke('fireLeave', e)
        if (!suspend && !e.p) {
          resume()
        }
      }
    })
  }
})
});