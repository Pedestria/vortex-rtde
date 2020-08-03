const vortex = require("./");
const path = require('path')

vortex.createStarPackage(path.resolve(__dirname,'./vortex.panel.js')).catch(err => console.log(err));