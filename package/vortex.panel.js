module.exports = {
    type:'app',
    bundleMode:'star',
    useTerser:false,
    start:'./test/web/Main.jsx',
    output:'./out/webapp.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    polyfillPromise:true

}