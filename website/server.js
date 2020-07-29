var http = require('http');
var path = require('path')
var express = require('express')

var main = express()

//create a server object:
var server = http.createServer(main).listen(8080);

main.use(express.static(path.resolve(__dirname,'./client/dist/')));

main.get("/*",function(req,res){res.sendFile(path.resolve(__dirname,"./client/dist/index.html"))});

