var http = require('http');
var path = require('path')
var express = require('express')

var main = express()

//create a server object:
var server = http.createServer(main);

main.use(express.static(path.resolve(__dirname,'./test')))

const VortexRTDE = require('../package');

