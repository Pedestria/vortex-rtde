const vortex = require("..");
const path = require('path');

vortex.createStarPackage(path.resolve(__dirname,'../vortex.final.js')).catch(err => console.log(err));