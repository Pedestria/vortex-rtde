var http = require('http');
var path = require('path')
var express = require('express')

var main = express()

//create a server object:
http.createServer(main).listen(8080,null,function() {
    
}); 

//the server object listens on port 8080

main.use(express.static(path.resolve(__dirname,'./test')))

// main.get('/*', function(req,res) {res.sendFile(path.resolve(__dirname,'./test/test.html'))})

const {LivePush} = require('./lib/live/LivePush')

new LivePush('',path.resolve(__dirname,'./test/live.html'),'./test/web/Main.jsx',main);

