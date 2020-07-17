 const {VueVortexAddon} = require('../package/lib/addons/VueAddon')

module.exports = {

    type:'app',
    bundleMode:'star',
    useTerser:false,
    start:'./src/Main.js',
    output:'./client/dist/webapp.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    addons:[VueVortexAddon],
    cssPlanet:false,
    minifyCssPlanet:false

}