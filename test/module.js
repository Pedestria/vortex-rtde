(function(modules){
    //Named Exports For Module
    var shuttle_exports = {}
    //Default Export For Module
    var shuttle_default = {}

    //Shuttle (New Module Definition)
    //Finds exports and returns them under fake namespace.
    function shuttle(mod_name){
        var fakeNamespace = {
            named:{},
            default:{}
        }
        modules[mod_name](shuttle,fakeNamespace.named = shuttle_exports,fakeNamespace.default = shuttle_default)
        return fakeNamespace
    }

    //Calls Entrypoint to Initialize
    modules["./module2"](shuttle,shuttle_exports,shuttle_default)

}({
    "./module1": (function(shuttle,shuttle_exports,shuttle_default){
        "use strict"
        eval('console.log("module1"); function LogMe(){console.log("Named Export Call");};function defCall(name){console.log(name);}; shuttle_exports.LogMe = LogMe; shuttle_default.export = defCall;')
    }),
    "./module2": (function(shuttle,shuttle_exports,shuttle_default){
        "use strict"
        eval('console.log("module2"); var _module1 = shuttle("./module1"); var _module3 = shuttle("./module3"); _module3.named.LogMoo(); _module1.named.LogMe(); _module1.default.export("Default Export Call With Param")')
    }),
    "./module3": (function(shuttle,shuttle_exports,shuttle_default){
        "use strict"
        eval('console.log("module3"); function LogMoo(){console.log("Named Export Call2")}; shuttle_exports.LogMoo = LogMoo')
    }),
}))



//Shuttle Module (SM)

//var lib = shuttle("lib") --> Intializes Library
//lib.named.b() --> Named Import from lib
//lib.default.export() --> Default Import from lib

//shuttle_exports.b = b --> Named Export
//shuttle_default.export = a --> Default Export


