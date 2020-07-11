(function(factory) {
    if(typeof shuttle.planetCluster === 'function' && shuttle.planetCluster.amdRegistrar){
        define(['lodash'],factory)
    }
}(function(lodash) {

    var _ = lodash._
    console.log(_.chunk([1,2,4,5,2,3,4,2,1,5],2))

    var array = ['a','c','b','b','c','d']
    _.pull(array,'a','c')
    console.log(array)
}))