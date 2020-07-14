const {VueVortexAddon} = require('./lib/addons/VueAddon')

module.exports = {
    type:'app',
    bundleMode:'neutronstar',
    useTerser:false,
    start:'./test/web/Main.jsx',
    output:'./out/webapp.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    polyfillPromise:false,
    addons:[VueVortexAddon],
    outBundle:['aws-sdk']

}