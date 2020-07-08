(function(modules){
  var loadedModules = [];
  var loadedStyles = [];
  var loadedExportsByModule = {}; 

  var loadedPlanets = [];
  var loadedPlanetEntryExports = {}

  var local_modules = modules
  
  //Shuttle Module Loader
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

  // SML's version of ES Dynamic Import (Returns entry point module export of planet)
  
  shuttle.planet = function(planet_name) {

    return new Promise(function(resolve,reject){
        if(loadedPlanets.includes(planet_name)){
            resolve(loadedPlanetEntryExports[planet_name].cachedExports);
        }
        else{
            var planet = document.createElement('script');
            planet.src = planet_name;
            document.body.appendChild(planet);
            planet.addEventListener('load',function(){
                planetLoaded().then(
                    function(exports){
                        loadedPlanets.push(planet_name);
                        var o = new Object(planet_name);
                        Object.defineProperty(o, 'cachedExports', {
                            value: exports,
                            writable: false
                        });
                        Object.defineProperty(loadedPlanetEntryExports, planet_name, {
                            value: o
                        });

                        resolve(exports);
                    })
            },false)

            var entryPoint

            function planetLoaded(){
                return new Promise(function(resolve,reject){
                    console.log('Loading from '+planet_name);
                    shuttle.override(planetmodules);
                    entryPoint = entry;
                    resolve(shuttle(entryPoint));
                })
            }

        }
    })

      
  }

  shuttle.override = function(mods){
      local_modules = mods
  }

  shuttle.planetCluster = function(planets_array,callback){
      function defineCluster(){
        return new Promise(function(resolve, reject){
            var moduleObjects = planets_array.map(function(planet) {return shuttle.planet(planet)})
            Promise.all(moduleObjects).then(function(module_objs) {
                var newModObjs = module_objs.map(function(modObj) {
                    return Object.keys(modObj).length === 1 && Object.keys(modObj)[0] === 'default'? modObj.default : modObj
                })
                resolve(newModObjs)
            })
        })
    }
      defineCluster().then(function (moduleObjects) {
          callback.apply(null,moduleObjects)
      })
  }
  
  
  
  //Calls EntryPoint to Initialize

  return shuttle("./module2");

}({
    "./module1": (function(shuttle,shuttle_exports){
        "use strict"
        console.log("module1"); 
        function LogMe(){console.log("Named Export Call");};
        function defCall(name){console.log(name);}; 
        shuttle_exports.LogMe = LogMe; 
        shuttle_exports.default = defCall; 
        shuttle.planetCluster(['./planet.js','./planet2.js'],function(planet1,planet2) {
            planet1()
            planet2.here()
        })
    }),
    "./module2": (function(shuttle,shuttle_exports){
        "use strict"
        console.log("module2"); 
        var _module1 = shuttle("./module1"); 
        var _assign = shuttle("object-assign"); 
        console.log(_assign.default({foo: 0}, {bar: 1}, undefined,null)); 
        _module1.LogMe(); 
        _module1.default("Default Export Call With Param");
    }),
    "object-assign": (function(shuttle,shuttle_exports){
                /*
        object-assign
        (c) Sindre Sorhus
        @license MIT
        */

        'use strict';
        /* eslint-disable no-unused-vars */
        var getOwnPropertySymbols = Object.getOwnPropertySymbols;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var propIsEnumerable = Object.prototype.propertyIsEnumerable;

        function toObject(val) {
            if (val === null || val === undefined) {
                throw new TypeError('Object.assign cannot be called with null or undefined');
            }

            return Object(val);
        }

        function shouldUseNative() {
            try {
                if (!Object.assign) {
                    return false;
                }

                // Detect buggy property enumeration order in older V8 versions.

                // https://bugs.chromium.org/p/v8/issues/detail?id=4118
                var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
                test1[5] = 'de';
                if (Object.getOwnPropertyNames(test1)[0] === '5') {
                    return false;
                }

                // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                var test2 = {};
                for (var i = 0; i < 10; i++) {
                    test2['_' + String.fromCharCode(i)] = i;
                }
                var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                    return test2[n];
                });
                if (order2.join('') !== '0123456789') {
                    return false;
                }

                // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                var test3 = {};
                'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                    test3[letter] = letter;
                });
                if (Object.keys(Object.assign({}, test3)).join('') !==
                        'abcdefghijklmnopqrst') {
                    return false;
                }

                return true;
            } catch (err) {
                // We don't expect any of the above to throw, but better to be safe.
                return false;
            }
        }

        shuttle_exports.default = shouldUseNative() ? Object.assign : function (target, source) {
            var from;
            var to = toObject(target);
            var symbols;

            for (var s = 1; s < arguments.length; s++) {
                from = Object(arguments[s]);

                for (var key in from) {
                    if (hasOwnProperty.call(from, key)) {
                        to[key] = from[key];
                    }
                }

                if (getOwnPropertySymbols) {
                    symbols = getOwnPropertySymbols(from);
                    for (var i = 0; i < symbols.length; i++) {
                        if (propIsEnumerable.call(from, symbols[i])) {
                            to[symbols[i]] = from[symbols[i]];
                        }
                    }
                }
            }

            return to;
        };
    }),
}))



//Shuttle Module (SM)

//var lib = shuttle("lib") --> Intializes Library
//lib.named.b() --> Named Import from lib
//lib.default.export() --> Default Import from lib

//shuttle_exports.b = b --> Named Export
//shuttle_default.export = a --> Default Export


