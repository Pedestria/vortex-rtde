const marked = require('marked');
const glob = require('glob')
const {promisify} = require('util');
const fs = require('fs/promises');

var globAsync = promisify(glob);


var files = await globAsync("./src/docs/**");

for(let file of files){
    let markdown = await fs.readFile(file);
    
}





