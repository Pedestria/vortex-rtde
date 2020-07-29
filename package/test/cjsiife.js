/*COMMON JS IIFE */
/*BUNDLED BY VORTEX RTDE*/
(function(local_files){
    var fileExportBuffer = {};

    var _ = require('lodash');
    var chalk = require('chalk');

    var _externalProvider = {};
    _externalProvider._ = _;
    _externalProvider.chalk = chalk;

    function _localRequire(id){
        if(fileExportBuffer[id] && fileExportBuffer[id].built){
            return fileExportBuffer[id].exports
        }
        else {
            var localFile = {
                built:false,
                exports:{}
            }
            local_files[id](_localRequire,localFile.exports,_externalProvider)

            localFile.built = true

            Object.defineProperty(fileExportBuffer,id,{
                value:localFile,
                writable:false,
                enumerable:true
            })

            return localFile.exports
        }
    }

    return _localRequire("main");
})({
    "main":(function(_localRequire,_localExports,_externalProvider){

        const second = _localRequire("second")

        function hello(){
            console.log(_externalProvider.chalk.red("hello"))
            console.log(_externalProvider._.flatten([1,2,3,[1,4,6,8],8,9]))
            second.default("poop!");
        }

        exports.hello = hello
        exports.LodashVersion = _externalProvider._.VERSION;
    }),
    "second":(function(_localRequire,_localExports,_externalProvider){
        _localExports.default = function(name){
            console.log(name);
        }
    })
})