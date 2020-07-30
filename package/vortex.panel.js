// const {VueVortexAddon} = require('../addons/vue-addon')

const path =require('path')

module.exports = {
    type:'library',
    livePushOptions:{
        entry:"./test/web/Main.jsx",
        dirToHTML:path.resolve(__dirname,"./test/live.html"),
        fileDependencyDirs:['./test/img'],
        CDNImports:[]
    },
    bundleMode:'neutronstar',
    useTerser:true,
    start:'./test/vortex/Index.js',
    output:'./out/vortex.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    polyfillPromise:false,
    // addons:[VueVortexAddon],
    outBundle:['aws-sdk'],
    cssPlanet:true,
    minifyCssPlanet:true

}