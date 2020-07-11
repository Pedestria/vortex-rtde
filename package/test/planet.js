var entry = "./module4";
var planetmodules = {
    "./module4": (function(shuttle,shuttle_exports){
        var _mod5 = shuttle('./module5')
        function welcome(){
            console.log('Welcome Here!')
            _mod5.other()
        }
        shuttle_exports.default = welcome
    }),
    "./module5": (function(shuttle,shuttle_exports){
        var _assign = shuttle("object-assign")
        function other(){
            console.log('Over here!')
        }
        shuttle_exports.other = other
        console.log(_assign.default({foeeo: 0}, {baar: 1},{hee: 4}, {bell: 12}))
    })
};