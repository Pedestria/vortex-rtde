(function(live_modules){
   
  var loadedModules = [];
  var loadedExportsByModule = {};



  function loadExports(module, namespace) {

    if(loadedModules.includes(module)){
      if(namespace){
        var namespace0 = {};
        Object.defineProperty(namespace0,namespace,{
          writable:false,
          enumerable:true,
          value:loadedExportsByModule[module].cachedExports
        })

        var obj = Object.entries(loadedExportsByModule[module].cachedExports).concat(Object.entries(namespace0))
        return Object.fromEntries(obj)

      }
      else{
        return loadedExportsByModule[module].cachedExports
      }
    }
    else{
      //Named Exports
      var exports = {}; 
      
      //Default Export

      var mod = {
        exports: {}
      };
      live_modules[module](loadExports, exports, mod);
    
      if (module.includes('./')) {
          var obj = {};
          Object.defineProperty(obj, namespace, {
            value: mod.exports,
            enumerable: true
          });

          if (namespace) {
            var exps = Object.assign(exports, obj);
            cacheExports(module,exps);
            return exps;
          } else {
            var exps = Object.assign(exports, mod.exports)
            cacheExports(module,exps);
            return exps;
          }

      } else {
          if (namespace) {
            var finalNamespace = {};
            Object.defineProperty(finalNamespace,namespace,{
              value:exports,
              enumerable:true,
              writable:false
            })
            var entries = Object.entries(exports).concat(Object.entries(finalNamespace))
            var exps = Object.fromEntries(entries)
            cacheExports(module,exports)
            return exps;
          } else if (exports) {
            cacheExports(module,exports)
            return exports;
          } else if (mod.exports) {
            cacheExports(module,mod.exports)
            return mod.exports;
          }
      }
    }
  }

  function cacheExports(mod_name,mod_exports){
    var o = new Object(mod_name);
        Object.defineProperty(o, 'cachedExports', {
          value: mod_exports,
          writable: false
        });
        Object.defineProperty(loadedExportsByModule, mod_name, {
          value: o
        });
      loadedModules.push(mod_name);
  }

  return loadExports('./module2');

}({'./module2':(function(loadExports,exports,module){
  var EXPORTS = loadExports('./module3');

  var EXPORTS = loadExports('module1',"NAMESPACE")

  ,NAMESPACE = EXPORTS.NAMESPACE,
  OtherFunc = EXPORTS.OtherFunc;

  NAMESPACE.HelloWorld()

  OtherFunc('Hi there from Module2')



}),
'module1':(function(loadExports,exports,module){

  function HelloWorld(){
    console.log('Hello World!!')
  }

  function OtherFunc(message){
    console.log(message)
  }

  exports.HelloWorld = HelloWorld
  exports.OtherFunc = OtherFunc


}),'./module3':(function(loadExports,exports,module){

  var MODULE_1 = loadExports('module1',"OTHERTHING"),
  OTHERTHING = MODULE_1.OTHERTHING

  OTHERTHING.HelloWorld()

})
    
}))