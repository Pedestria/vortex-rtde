/*COMMON JS IIFE */
/*BUNDLED BY VORTEX RTDE*/

(function(local_files){
    var fileExportBuffer = new Map();

    var loadedFiles = [];

    var _ = require('lodash');
    var chalk = require('chalk');

    function _localRequire(id){
        console.log(id,loadedFiles);
        if(loadedFiles.includes(id)){
            console.log(fileExportBuffer)
            return fileExportBuffer.get(id).exports;
        }
        else {
            var localFile = {
                built:true,
                exports:{}
            }
            loadedFiles.push(id);
            local_files[id](_localRequire,localFile.exports,_,chalk)

            fileExportBuffer.set(id,localFile);

            if(loadedFiles.includes(id)){
                return localFile.exports
            }
        }
    }

    return _localRequire("main");
})({
    "main":(function(_localRequire,_localExports,_,chalk){

        const second = _localRequire("second")

        function hello(){
            console.log(chalk.red("hello"))
            console.log(_.flatten([1,2,3,[1,4,6,8],8,9]))
            second.default("poop!");
        }

        exports.hello = hello
        exports.LodashVersion = _.VERSION;
    }),
    "second":(function(_localRequire,_localExports,_,chalk){

        _localRequire("main");

        _localExports.default = function(name){
            console.log(name);
        }
    })
})