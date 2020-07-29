const vortex = require('../package');
const path = require('path');

// console.log(vortex(path.resolve(__dirname,'./vortex.panel.js')))

vortex.createStarPackage(path.resolve(__dirname,'./vortex.panel.js'));
