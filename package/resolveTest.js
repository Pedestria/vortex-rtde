const resolve = require('resolve')
const path = require('path')

console.log(path.relative(__dirname,resolve.sync('react')))