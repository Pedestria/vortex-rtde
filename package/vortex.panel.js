const {VueVortexAddon} = require('./lib/addons/VueAddon')

module.exports = {
    type:'library',
    bundleMode:'neutronstar',
    useTerser:true,
    start:'./test/vortex/Index.js',
    output:'./out/vortex.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    polyfillPromise:false,
    addons:[VueVortexAddon],
    outBundle:['aws-sdk'],
    cssPlanet:true,
    minifyCssPlanet:true

}