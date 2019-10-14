/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: xinglie.lkf@alibaba-inc.com; kooboy_li@163.com
 */
define('app/vclick',["magix","jquery"],function(require,exports,module){
/*Magix,$*/
var Magix = require('magix')
var $ = require('jquery')

$('body').on('click', 'a', function(e) {
  var $tar = $(e.currentTarget)
  var href = $tar.attr('href')
  var ignore = $tar.attr('vclick-ignore')

  if (href && /^\/[^\/]/.test(href) && !ignore) {
    e.preventDefault()
    Magix.Router.to(href)
  }
})

});