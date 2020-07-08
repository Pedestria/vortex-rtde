const fs = require('fs-extra')
const Babel = require('@babel/parser')

fs.writeJSONSync('./tree.json',Babel.parse(fs.readFileSync('./test/func.js').toString()))