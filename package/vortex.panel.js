// const {VueVortexAddon} = require('../addons/vue-addon')

const path =require('path')

module.exports = {
    type:'library',
    livePushOptions:{
        entry:"./debug/src/Index.jsx",
        dirToHTML:path.resolve(__dirname,"./debug/debug.html"),
        CDNImports:[]
    },
    bundleMode:'neutronstar',
    useTerser:false,
    start:'./test/vortex/Index.js',
    output:'./dist/vortex.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    polyfillPromise:false,
    addons:[],
    outBundle:['aws-sdk'],
    cssPlanet:true,
    minifyCssPlanet:true

}