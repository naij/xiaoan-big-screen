var script=function(){var e=document.getElementsByTagName("script");return e[e.length-1]}(),base=function(){var e=script.getAttribute("src"),a=/(.*\/)(.+\/.+)/.exec(e)[1];return a}();seajs.config({alias:{jquery:"app/libs/jquery",magix:"app/libs/magix",pat:"app/libs/pat",moment:"app/libs/moment",underscore:"app/libs/underscore"},base:base,charset:"utf-8"}),seajs.use(["magix","jquery"],function(e){e.boot({ini:"app/ini"})});