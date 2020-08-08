const path =require('path')

module.exports = {
    type:'library',
    bundleMode:'neutronstar',
    useTerser:true,
    start:'./test/vortex/Index.js',
    output:'./dist/vortex.js',
    addons:[],
    extensions:[]
}