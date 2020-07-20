(function(modules){
    var loadedModules = [];
    var loadedStyles = [];
    var loadedExportsByModule = {};
    var local_modules = modules; //Shuttle Module Loader
    //Finds exports and returns them under fake namespace.
  
    function shuttle(mod_name) {
      //If module has already been loaded, load the exports that were cached away.
      if (loadedModules.includes(mod_name)) {
        return loadedExportsByModule[mod_name].cachedExports;
      } else {
        var mod = {
          exports: {}
        };
        local_modules[mod_name](shuttle, mod.exports, loadedStyles);
        var o = new Object(mod_name);
        Object.defineProperty(o, 'cachedExports', {
          value: mod.exports,
          writable: false
        });
        Object.defineProperty(loadedExportsByModule, mod_name, {
          value: o
        });
        loadedModules.push(mod_name);
        return mod.exports;
      }
    } 
    
  
    //Calls EntryPoint to Initialize
  
    return shuttle("./module2");

}({
    
}))