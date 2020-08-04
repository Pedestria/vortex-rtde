var http = require('http');
var path = require('path')
var express = require('express')

var main = express()

//create a server object:
var server = http.createServer(main);

//the server object listens on port 8080

main.use(express.static(path.resolve(__dirname,'./debug')))

// main.get('/*', function(req,res) {res.sendFile(path.resolve(__dirname,'./test/test.html'))})

const {LivePush} = require('./')

new LivePush(path.resolve(__dirname,"./vortex.panel.js"),main,server,8080,true);


