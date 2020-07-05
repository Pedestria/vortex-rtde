module.exports = {
    type:'app',
    bundleMode:'neutronstar',
    useTerser:false,
    start:'./test/web/Main.jsx',
    output:'./out/webapp.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true

}