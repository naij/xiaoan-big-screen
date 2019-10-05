var fs = require('fs')
var path = require('path')
var mat   = require('mat')
var proxy = require('mat-proxy')
var less  = require('mat-less')

// 预编译less
mat.task('less', function () {
  mat.url([/.*\.css/])
    .rewrite([
      [/\.css/g, '.less']
    ])
    .use(less({
      sourceMap: {sourceMapFileInline: true}
    }))
})

mat.task('default', function () {
  mat.url([/\/tp\//])
    .use(proxy({
      proxyPass: '183.129.224.22:7777'
    }))
})