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
  mat.url([/\.json/])
    .use(proxy({
      proxyPass: '127.0.0.1:7002'
    }))
})