var entry = "./module7"
var planetmodules = {
    "./module6": (function(shuttle,shuttle_exports){
        var _mod4 = shuttle('./module4')
        _mod4.welcome()
        
    }),
    "./module7": (function(shuttle,shuttle_exports){
        var _assign = shuttle("object-assign")
        var _mod6 = shuttle('./module6')

        function here(){
            console.log('I AM THE BEST!!! JUST AMAZING!!')
        }

        shuttle_exports.here = here

        console.log(_assign.default({foeeo: 0}, {baar: 1},{hee: 4}, {bell: 12}))
    })
}